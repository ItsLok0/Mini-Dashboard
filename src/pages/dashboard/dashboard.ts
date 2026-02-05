import { Component } from '@angular/core';
import { WeatherStore } from '../../app/store/WeatherStore';
import { WeatherDashboard } from "./weather-dashboard/weather-dashboard";
import { DailyQuote } from "./daily-quote/daily-quote";

@Component({
  selector: 'app-dashboard',
  imports: [WeatherDashboard, DailyQuote],
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
