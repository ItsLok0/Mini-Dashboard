import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from '../pages/dashboard/dashboard';
import { Profile } from '../pages/profile/profile';
import { DailyTasks } from '../pages/daily-tasks/daily-tasks';
import { Productivity } from '../pages/productivity/productivity';
import { NgModule } from '@angular/core';
import { Weather } from '../pages/weather/weather';
import { Crypto } from '../pages/crypto/crypto';

export const routes: Routes = [
    { path: '', component: Dashboard },
    { path: 'dashboard', component: Dashboard },
    { path: 'profile', component: Profile },
    { path: 'tasks', component: DailyTasks },
    { path: 'productivity', component: Productivity },
    { path: 'weather', component: Weather },
    { path: 'crypto', component: Crypto },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}