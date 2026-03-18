import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PomodoroService, PomodoroSessionType } from '../services/pomodoro';

type PomodoroMode = PomodoroSessionType;

interface PersistedPomodoroState {
  mode: PomodoroMode;
  running: boolean;
  startedAtMs: number | null;
  endsAtMs: number | null;
  remainingSec: number;
  focusCountSinceLongBreak: number;
  label: string;
}

const STORAGE_KEY = 'pomodoro_state_v1';

function clampInt(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.floor(n)));
}

function formatLabel(raw: string) {
  return raw.replace(/\s+/g, ' ').trim().slice(0, 80);
}

@Injectable({ providedIn: 'root' })
export class PomodoroStore {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly pomodoroService = inject(PomodoroService);

  // Settings (can be moved to Firestore later)
  focusMin = signal(25);
  breakMin = signal(5);
  longBreakMin = signal(15);
  longBreakEvery = signal(4);

  mode = signal<PomodoroMode>('focus');
  remainingSec = signal(25 * 60);
  running = signal(false);
  focusCountSinceLongBreak = signal(0);
  label = signal('');

  private intervalId: number | null = null;
  private startedAtMs: number | null = null;
  private endsAtMs: number | null = null;

  constructor() {
    this.restore();
    this.resumeIfNeeded();
  }

  setLabel(v: string) {
    this.label.set(formatLabel(v));
    this.persist();
  }

  setMode(mode: PomodoroMode) {
    if (this.running()) return;
    this.mode.set(mode);
    this.remainingSec.set(this.getDefaultDurationSec(mode));
    this.persist();
  }

  start() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.running()) return;

    const now = Date.now();
    const durationSec = this.remainingSec();

    this.startedAtMs = now;
    this.endsAtMs = now + durationSec * 1000;
    this.running.set(true);
    this.tick(); // immediate UI update

    this.intervalId = window.setInterval(() => this.tick(), 250);
    this.persist();
  }

  pause() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.running()) return;

    this.tick();
    this.clearInterval();
    this.running.set(false);
    this.startedAtMs = null;
    this.endsAtMs = null;
    this.persist();
  }

  stop() {
    if (!isPlatformBrowser(this.platformId)) return;
    const wasRunning = this.running();
    const completed = false;

    const session = this.buildSession(completed, 1);
    if (session) void this.pomodoroService.addSession(session);

    this.clearInterval();
    this.running.set(false);
    this.startedAtMs = null;
    this.endsAtMs = null;
    this.remainingSec.set(this.getDefaultDurationSec(this.mode()));
    this.persist();

    // If it wasn't running, we still reset UI state safely
    if (!wasRunning) return;
  }

  skip() {
    if (!isPlatformBrowser(this.platformId)) return;
    const session = this.buildCompletedSession();
    void this.pomodoroService.addSession(session);
    this.onSessionComplete();
  }

  private tick() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.running() || this.endsAtMs === null) return;

    const secLeft = Math.max(0, Math.ceil((this.endsAtMs - Date.now()) / 1000));
    this.remainingSec.set(secLeft);

    if (secLeft <= 0) {
      const session = this.buildCompletedSession();
      if (session) void this.pomodoroService.addSession(session);
      this.onSessionComplete();
      return;
    }

    // Persist occasionally to survive refresh/crash without spamming localStorage
    if (secLeft % 10 === 0) this.persist();
  }

  private onSessionComplete() {
    this.clearInterval();
    this.running.set(false);
    this.startedAtMs = null;
    this.endsAtMs = null;

    if (this.mode() === 'focus') {
      const nextFocusCount = this.focusCountSinceLongBreak() + 1;
      const needsLongBreak = nextFocusCount % this.longBreakEvery() === 0;
      this.focusCountSinceLongBreak.set(nextFocusCount);
      this.mode.set(needsLongBreak ? 'longBreak' : 'break');
    } else {
      this.mode.set('focus');
    }

    this.remainingSec.set(this.getDefaultDurationSec(this.mode()));
    this.persist();
  }

  private buildSession(completed: boolean, minDurationSec = 5) {
    if (!isPlatformBrowser(this.platformId)) return null;

    const mode = this.mode();
    const defaultSec = this.getDefaultDurationSec(mode);
    const remaining = clampInt(this.remainingSec(), 0, defaultSec);
    const durationSec = defaultSec - remaining;

    // Avoid writing empty “sessions” when user just clicks around
    if (durationSec < minDurationSec) return null;

    const now = new Date();
    const startedAt = this.startedAtMs ? new Date(this.startedAtMs) : new Date(now.getTime() - durationSec * 1000);

    return {
      type: mode,
      durationSec,
      startedAt,
      endedAt: now,
      completed,
      ...(this.label() ? { label: this.label() } : {}),
    };
  }

  private buildCompletedSession() {
    const mode = this.mode();
    const defaultSec = this.getDefaultDurationSec(mode);
    const now = new Date();
    return {
      type: mode,
      durationSec: defaultSec,
      startedAt: new Date(now.getTime() - defaultSec * 1000),
      endedAt: now,
      completed: true,
      ...(this.label() ? { label: this.label() } : {}),
    };
  }

  getDefaultDurationSec(mode: PomodoroMode) {
    const min =
      mode === 'focus'
        ? this.focusMin()
        : mode === 'break'
          ? this.breakMin()
          : this.longBreakMin();

    return clampInt(min, 1, 180) * 60;
  }

  formatTime(sec: number) {
    const s = clampInt(sec, 0, 24 * 60 * 60);
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  private clearInterval() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private persist() {
    if (!isPlatformBrowser(this.platformId)) return;
    const state: PersistedPomodoroState = {
      mode: this.mode(),
      running: this.running(),
      startedAtMs: this.startedAtMs,
      endsAtMs: this.endsAtMs,
      remainingSec: this.remainingSec(),
      focusCountSinceLongBreak: this.focusCountSinceLongBreak(),
      label: this.label(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore: storage can be blocked
    }
  }

  private restore() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<PersistedPomodoroState>;

      const mode = parsed.mode === 'focus' || parsed.mode === 'break' || parsed.mode === 'longBreak' ? parsed.mode : 'focus';
      this.mode.set(mode);

      const defaultSec = this.getDefaultDurationSec(mode);
      const remaining = clampInt(Number(parsed.remainingSec ?? defaultSec), 0, defaultSec);
      this.remainingSec.set(remaining);

      this.focusCountSinceLongBreak.set(clampInt(Number(parsed.focusCountSinceLongBreak ?? 0), 0, 10_000));
      this.label.set(formatLabel(String(parsed.label ?? '')));

      this.running.set(Boolean(parsed.running));
      this.startedAtMs = typeof parsed.startedAtMs === 'number' ? parsed.startedAtMs : null;
      this.endsAtMs = typeof parsed.endsAtMs === 'number' ? parsed.endsAtMs : null;
    } catch {
      // ignore corrupted state
    }
  }

  private resumeIfNeeded() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.running()) return;
    if (this.endsAtMs === null) {
      this.running.set(false);
      this.persist();
      return;
    }

    const now = Date.now();
    if (now >= this.endsAtMs) {
      this.remainingSec.set(0);
      const session = this.buildSession(true);
      if (session) void this.pomodoroService.addSession(session);
      this.onSessionComplete();
      return;
    }

    this.intervalId = window.setInterval(() => this.tick(), 250);
  }
}

