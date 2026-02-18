import { inject, Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc } from '@angular/fire/firestore';
import { of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  // Récupérer les tâches (Temps réel)
  getTasks() {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          const tasksPath = `users/${user.uid}/tasks`;
          const tasksRef = collection(this.firestore, tasksPath);
          // collectionData renvoie un flux qui se met à jour tout seul
          return collectionData(tasksRef, { idField: 'id' });
        }
        return of([]);
      })
    );
  }

  // Ajouter une tâche
  async addTask(title: string) {
    const user = this.auth.currentUser;
    if (user) {
      const tasksRef = collection(this.firestore, `users/${user.uid}/tasks`);
      return addDoc(tasksRef, {
        title,
        completed: false
      });
    }
    return null;
  }

  // Mettre à jour le statut (C'est cette fonction que ton composant appellera)
  async updateTaskStatus(taskId: string, completed: boolean) {
    const user = this.auth.currentUser;
    if (user) {
      const taskDocRef = doc(this.firestore, `users/${user.uid}/tasks/${taskId}`);
      return updateDoc(taskDocRef, { completed });
    }
  }
}