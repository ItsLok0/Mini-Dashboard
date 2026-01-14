import { Component, input } from '@angular/core';

@Component({
  selector: 'app-weather-dashboard',
  imports: [],
  templateUrl: './weather-dashboard.html',
  styleUrl: './weather-dashboard.scss',
})
export class WeatherDashboard {
  weather = input<any>();
}
