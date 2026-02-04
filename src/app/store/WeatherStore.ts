import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WeatherStore {
  weatherData = signal<any>(null);
  forecastData = signal<any[]>([]);

  apiKey = '957afc91f2d361976cd86461dcb6d694';

  constructor(private http: HttpClient) {}

  initWeather() {
    if (typeof window === 'undefined') return;
    const savedCity = localStorage.getItem('weather_city') as string;

    if (savedCity) {
      this.getWeather(savedCity);
      return;
    }
    this.getUserLocationWeather();
  }

  getUserLocationWeather() {
    if (!navigator.geolocation) {
      this.getWeather('Paris');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        this.http.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=fr`
        ).subscribe({
          next: data => this.weatherData.set(data),
          error: err => console.error(err)
        });

        this.http.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=fr`
        ).subscribe({
          next: (res: any) => this.forecastData.set(res.list.slice(0, 5)),
          error: err => console.error(err)
        });
      },
      error => {
        this.getWeather('Paris');
        console.error('Géolocalisation refusée', error);
      }
    );
  }

  getWeather(city: string) {
    this.http.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=fr`
    ).subscribe({
      next: data => this.weatherData.set(data),
      error: err => console.error('Erreur API:', err)
    });

    this.http.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric&lang=fr`
    ).subscribe({
      next: (res: any) => {
        this.forecastData.set(res.list.slice(0, 5));
      },
      error: err => console.error('Erreur API:', err)
    });
  }
}
