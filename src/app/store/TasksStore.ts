import { inject, Injectable, signal } from '@angular/core';
import { TasksService } from '../services/tasks';

@Injectable({ providedIn: 'root' })
export class TasksStore {
  taskList = signal<any>(null);
  private tasksService = inject(TasksService);
  forecastData = signal<any[]>([]);

  constructor() {}

  // Méthode pour basculer le statut d'une tâche
  async toggleTaskCompletion(taskId: string, currentStatus: boolean): Promise<void> {
    try {
      await this.tasksService.updateTaskStatus(taskId, !currentStatus);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche :", error);
    }
  }

  // Méthode pour ajouter une nouvelle tâche
  async onAddTask(task: any) {
    try {
      await this.tasksService.addTask(task);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche :", error);
    }
  }

  getPercentage(tasks: any[]): number {
    if (!tasks.length) return 0;
    return Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
  }
}
