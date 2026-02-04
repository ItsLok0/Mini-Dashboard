import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from '../pages/dashboard/dashboard';
import { DailyTasks } from '../pages/daily-tasks/daily-tasks';
import { Productivity } from '../pages/productivity/productivity';
import { NgModule } from '@angular/core';
import { Weather } from '../pages/weather/weather';
import { Crypto } from '../pages/crypto/crypto';
import { Login } from '../pages/login/login';
import { authGuard } from './guards/auth-guard';
import { Register } from '../pages/register/register';

export const routes: Routes = [
    { path: '', component: Dashboard, title: 'Dashboard - Accueil', canActivate: [authGuard] },
    { path: 'dashboard', component: Dashboard, title: 'Dashboard - Accueil', canActivate: [authGuard] },
    { path: 'tasks', component: DailyTasks, title: 'Dashboard - Tâches journalières', canActivate: [authGuard] },
    { path: 'productivity', component: Productivity, title: 'Dashboard - Productivité', canActivate: [authGuard] },
    { path: 'weather', component: Weather, title: 'Dashboard - Météo', canActivate: [authGuard] },
    { path: 'crypto', component: Crypto, title: 'Dashboard - Crypto', canActivate: [authGuard] },
    { path: 'login', component: Login, title: 'Dashboard - Connexion' },
    { path: 'register', component: Register, title: 'Dashboard - Inscription' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}