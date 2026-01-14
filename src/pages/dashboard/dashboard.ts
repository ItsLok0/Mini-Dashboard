import { Component } from '@angular/core';
import { WeatherStore } from '../../app/store/WeatherStore';
import { WeatherDashboard } from "./weather-dashboard/weather-dashboard";

@Component({
  selector: 'app-dashboard',
  imports: [WeatherDashboard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss', 
})
export class Dashboard {
  constructor(public weatherStore: WeatherStore) {}

  ngOnInit(): void {
    if(!this.weatherStore.weatherData()) {
      this.weatherStore.initWeather();
    }
  }
  
  protected readonly title = 'Mini Dashboard';
}
