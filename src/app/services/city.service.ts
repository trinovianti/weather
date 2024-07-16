import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { City } from '../models/city';
import { WeatherService } from './weather.service';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  storageKey = 'cities';

  constructor(
    private storageService: StorageService,
    private weatherService: WeatherService
  ) { }

  async createCity(cityName: string): Promise<City> {
    const cities = this.storageService.findAll<City>(this.storageKey);
    if (cities.find(item => item.name == cityName)) throw new Error('The city name already registered, please use different name.');
    let city = await this.weatherService.getCityCoordinate(cityName);
    city = await this.weatherService.getWeatherDetails(city);
    this.storageService.save<City>(this.storageKey, city);
    return city;
  }

  async getCities(page: number, limit: number = 5): Promise<City[]> {
    const cities = this.storageService.findAll<City>(this.storageKey, page, limit, true);
    for(let i in cities) {
      cities[i] = await this.weatherService.getWeatherDetails(cities[i]);
      this.storageService.update(this.storageKey, cities[i].id, cities[i]);
    }
    return cities;
  }

  getCityCount(): number {
    const cities = this.storageService.findAll<City>(this.storageKey);
    return cities.length;
  }

  getCity(id: string): City | undefined {
    return this.storageService.find(this.storageKey, id);
  }

  clearAllCities() {
    this.storageService.clearAll(this.storageKey);
  }
}
