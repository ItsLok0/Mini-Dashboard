import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TasksService } from '../../app/services/tasks';
import { TasksStore } from '../../app/store/TasksStore';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-daily-tasks',
  imports: [AsyncPipe],
  templateUrl: './daily-tasks.html',
  styleUrl: './daily-tasks.scss',
})
export class DailyTasks {
  private tasksService = inject(TasksService);
  tasks$: Observable<any[]> = this.tasksService.getTasks();

  constructor(public tasksStore: TasksStore) {}
}
