import { Component, inject } from '@angular/core';
import { TasksService } from '../../../app/services/tasks';
import { map, Observable, Subscription } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TasksStore } from '../../../app/store/TasksStore';

@Component({
  selector: 'app-daily-tasks-dashboard',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './daily-tasks-dashboard.html',
  styleUrl: './daily-tasks-dashboard.scss',
})
export class DailyTasksDashboard {
  private tasksService = inject(TasksService);
  tasks$: Observable<any[]> = this.tasksService.getTasks();

  constructor(public tasksStore: TasksStore) {}
}
