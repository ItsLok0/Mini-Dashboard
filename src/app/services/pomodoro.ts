import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  getDocs,
  orderBy,
  query,
  limit,
  setDoc,
  where,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';

export type PomodoroSessionType = 'focus' | 'break' | 'longBreak';

type TimestampLike = { toDate: () => Date };

export interface PomodoroSession {
  id?: string;
  type: PomodoroSessionType;
  durationSec: number;
  startedAt: Date | TimestampLike;
  endedAt: Date | TimestampLike;
  completed: boolean;
  label?: string;
}

type RepairResult = {
  uid: string;
  movedFromRoot: number;
  normalizedInPlace: number;
  deletedInvalid: number;
};

function toDateMaybe(v: any): Date | null {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof v?.toDate === 'function') return v.toDate();
  return null;
}

function cleanLabel(v: any) {
  return String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, 80);
}

@Injectable({ providedIn: 'root' })
export class PomodoroService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  getRecentSessions(max = 50): Observable<PomodoroSession[]> {
    const user = this.auth.currentUser;
    if (!user) return of([]);

    const sessionsRef = collection(this.firestore, `users/${user.uid}/pomodoroSessions`);
    const q = query(sessionsRef, orderBy('startedAt', 'desc'), limit(max));
    return collectionData(q as any, { idField: 'id' }) as Observable<PomodoroSession[]>;
  }

  watchRecentSessions(max = 50): Observable<PomodoroSession[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of([]);
        const sessionsRef = collection(this.firestore, `users/${user.uid}/pomodoroSessions`);
        const q = query(sessionsRef, orderBy('startedAt', 'desc'), limit(max));
        return collectionData(q as any, { idField: 'id' }) as Observable<PomodoroSession[]>;
      })
    );
  }

  async addSession(session: PomodoroSession) {
    const user = this.auth.currentUser;
    if (!user) return null;

    // Ensure parent doc exists so Firebase Console can browse sub-collections
    await setDoc(
      doc(this.firestore, `users/${user.uid}`),
      { uid: user.uid, email: user.email ?? null, updatedAt: new Date() },
      { merge: true }
    );

    const sessionsRef = collection(this.firestore, `users/${user.uid}/pomodoroSessions`);
    return addDoc(sessionsRef, {
      type: session.type,
      durationSec: session.durationSec,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      completed: session.completed,
      uid: user.uid,
      ...(session.label ? { label: session.label } : {}),
    });
  }

  /**
   * Repairs visibility & data issues:
   * - moves legacy docs from root `pomodoroSessions` (if any) into `users/{uid}/pomodoroSessions`
   * - normalizes/cleans docs in-place (dates/label/duration)
   * - deletes clearly invalid docs
   */
  async repairMyPomodoroSessions(max = 500): Promise<RepairResult | null> {
    const user = this.auth.currentUser;
    if (!user) return null;

    await setDoc(
      doc(this.firestore, `users/${user.uid}`),
      { uid: user.uid, email: user.email ?? null, updatedAt: new Date() },
      { merge: true }
    );

    const result: RepairResult = {
      uid: user.uid,
      movedFromRoot: 0,
      normalizedInPlace: 0,
      deletedInvalid: 0,
    };

    // 1) Move any legacy root collection docs (common mistake during early dev)
    const rootRef = collection(this.firestore, 'pomodoroSessions');
    const rootQ = query(rootRef, where('uid', '==', user.uid), limit(max));
    const rootSnap = await getDocs(rootQ);
    for (const d of rootSnap.docs) {
      const data: any = d.data();
      const type = data.type as PomodoroSessionType;
      if (type !== 'focus' && type !== 'break' && type !== 'longBreak') continue;

      const startedAt = toDateMaybe(data.startedAt) ?? new Date();
      const endedAt = toDateMaybe(data.endedAt) ?? startedAt;
      const durationSec = Math.max(0, Math.floor(Number(data.durationSec ?? 0)));
      const completed = Boolean(data.completed);
      const label = cleanLabel(data.label);

      await addDoc(collection(this.firestore, `users/${user.uid}/pomodoroSessions`), {
        type,
        durationSec,
        startedAt,
        endedAt,
        completed,
        uid: user.uid,
        ...(label ? { label } : {}),
        migratedFrom: 'root/pomodoroSessions',
        migratedAt: new Date(),
      });
      await deleteDoc(d.ref);
      result.movedFromRoot += 1;
    }

    // 2) Normalize current user subcollection
    const userRef = collection(this.firestore, `users/${user.uid}/pomodoroSessions`);
    const userQ = query(userRef, orderBy('startedAt', 'desc'), limit(max));
    const userSnap = await getDocs(userQ);

    for (const d of userSnap.docs) {
      const data: any = d.data();
      const type = data.type as PomodoroSessionType;
      const startedAt = toDateMaybe(data.startedAt);
      const endedAt = toDateMaybe(data.endedAt);
      const durationSec = Math.floor(Number(data.durationSec ?? NaN));

      const typeOk = type === 'focus' || type === 'break' || type === 'longBreak';
      const datesOk = Boolean(startedAt && endedAt);
      const durationOk = Number.isFinite(durationSec) && durationSec >= 0 && durationSec <= 24 * 60 * 60;

      if (!typeOk || !datesOk || !durationOk) {
        // If it’s obviously broken, remove it (cleanup request)
        await deleteDoc(d.ref);
        result.deletedInvalid += 1;
        continue;
      }

      const label = cleanLabel(data.label);
      const needsUpdate =
        data.uid !== user.uid ||
        (data.label ?? '') !== label ||
        !(data.startedAt instanceof Date) ||
        !(data.endedAt instanceof Date);

      if (needsUpdate) {
        await setDoc(
          d.ref,
          {
            uid: user.uid,
            label: label || null,
            startedAt,
            endedAt,
          },
          { merge: true }
        );
        result.normalizedInPlace += 1;
      }
    }

    return result;
  }
}

