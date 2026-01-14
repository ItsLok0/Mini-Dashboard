import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from '../pages/dashboard/dashboard';
import { Profile } from '../pages/profile/profile';
import { DailyTasks } from '../pages/daily-tasks/daily-tasks';
import { Productivity } from '../pages/productivity/productivity';
import { NgModule } from '@angular/core';
import { Weather } from '../pages/weather/weather';
import { Crypto } from '../pages/crypto/crypto';

export const routes: Routes = [
    { path: '', component: Dashboard, title: 'Dashboard - Accueil' },
    { path: 'dashboard', component: Dashboard, title: 'Dashboard - Accueil' },
    { path: 'profile', component: Profile, title: 'Dashboard - Profil' },
    { path: 'tasks', component: DailyTasks, title: 'Dashboard - Tâches journalières' },
    { path: 'productivity', component: Productivity, title: 'Dashboard - Productivité' },
    { path: 'weather', component: Weather, title: 'Dashboard - Météo' },
    { path: 'crypto', component: Crypto, title: 'Dashboard - Crypto' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}