import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routes';

import { App } from './app';
import { Dashboard } from '../pages/dashboard/dashboard';
import { DailyTasks } from '../pages/daily-tasks/daily-tasks';
import { Weather } from '../pages/weather/weather';
import { WeatherDashboard } from '../pages/dashboard/weather-dashboard/weather-dashboard';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    RouterModule,
    DailyTasks,
    Weather,
    Dashboard,
    WeatherDashboard,
    App
  ],
  providers: []
})
export class AppModule {}
