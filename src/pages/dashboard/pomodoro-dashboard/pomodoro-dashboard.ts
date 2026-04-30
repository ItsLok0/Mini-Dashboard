import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PomodoroStore } from '../../../app/store/PomodoroStore';

@Component({
  selector: 'app-pomodoro-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './pomodoro-dashboard.html',
  styleUrl: './pomodoro-dashboard.scss',
})
export class PomodoroDashboard {
  public pomodoro = inject(PomodoroStore);

  modes: Array<{ key: 'focus' | 'break' | 'longBreak'; label: string }> = [
    { key: 'focus', label: 'Focus' },
    { key: 'break', label: 'Pause' },
    { key: 'longBreak', label: 'Pause longue' },
  ];
}

