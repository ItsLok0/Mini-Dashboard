import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from '../pages/dashboard/dashboard';
import { Profile } from '../pages/profile/profile';
import { DailyTasks } from '../pages/daily-tasks/daily-tasks';
import { Productivity } from '../pages/productivity/productivity';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', component: Dashboard },
    { path: 'dashboard', component: Dashboard },
    { path: 'profile', component: Profile },
    { path: 'tasks', component: DailyTasks },
    { path: 'productivity', component: Productivity }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}