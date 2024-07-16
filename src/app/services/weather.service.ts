import { Injectable } from '@angular/core';
import { City, Forcast } from '../models/city';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  API_BASE_URL = "https://api.openweathermap.org";
  API_KEY = "ba8d861a97198896d0e59e5589c99e33";

  constructor() { }

  getCityCoordinate(cityName: string): Promise<City> {
    return new Promise((resolve, reject) => {
      if (cityName === "") reject(new Error('City name cannot be empty'))
      const API_URL = `${this.API_BASE_URL}/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.API_KEY}`
      fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) reject(new Error('City name is not valid'))
        const { lat, lon, name } = data[0]
        resolve(new City(name, lat, lon))
      }).catch(() => {
        reject(new Error('An error occurred while fetching the city information!'))
      })
    })
  }

  getWeatherDetails(city: City): Promise<City> {
    return new Promise((resolve, reject) => {
      const WEATHER_API_URL = `${this.API_BASE_URL}/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${this.API_KEY}`
      fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        const uniqueForecastDays: number[] = []
        const fiveDaysForecast: any[] = data.list.filter((forecast: any) => {
          const forecastDate = new Date(forecast.dt_txt).getDate()
          if (!uniqueForecastDays.includes(forecastDate)) {
            return uniqueForecastDays.push(forecastDate)
          }
          return false
        })
        const forcasts: Forcast[] = [];
        for(let i in fiveDaysForecast) {
          const forcast = new Forcast(
            fiveDaysForecast[i].dt_txt.split(' ')[0],
            (fiveDaysForecast[i].main.temp - 273.15).toFixed(2),
            fiveDaysForecast[i].wind.speed,
            fiveDaysForecast[i].main.humidity,
            fiveDaysForecast[i].weather[0].icon,
            fiveDaysForecast[i].weather[0].description
          )
          if (i == '0') {
            city.todayForcast = forcast
          } else {
            forcasts.push(forcast);
          }
        }
        city.nextDayForcasts = forcasts;
        resolve(city);
      }).catch(() => {
        reject(new Error('An error occurred while fetching the weather information!'))
      })
    })
  }
}
