import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WeatherStore } from '../../app/store/WeatherStore';
import { pairs } from 'rxjs';

@Component({
  selector: 'app-weather',
  imports: [FormsModule, CommonModule],
  templateUrl: './weather.html',
  styleUrl: './weather.scss',
})
export class Weather implements OnInit {
  city = '';
  today = new Date().toISOString().split('T')[0];
  hour = new Date();

  apiKey = '957afc91f2d361976cd86461dcb6d694';

  constructor(public weatherStore: WeatherStore) {}

  ngOnInit(): void {
    if(!this.weatherStore.weatherData()) {
      this.weatherStore.initWeather();
    }
  }

  getWeather() {
    if(this.city.trim() === '') {
      return;
    }
    localStorage.setItem('weather_city', this.city);
    this.weatherStore.getWeather(localStorage.getItem('weather_city') || this.city);
  }
}
