import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routes';

import { App } from './app';
import { Dashboard } from '../pages/dashboard/dashboard';
import { Profile } from '../pages/profile/profile';
import { DailyTasks } from '../pages/daily-tasks/daily-tasks';
import { Weather } from '../pages/weather/weather';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    RouterModule,
    Profile,
    DailyTasks,
    Weather,
    Dashboard,
    App
  ],
  providers: []
})
export class AppModule {}
