import { Component } from '@angular/core';
import { City } from './models/city';
import { CityService } from './services/city.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'weather-app';
  page = 1;
  limit = 5;
  totalPage = 1;
  cityName: string = '';
  cities: City[] = [];
  selectedCity: City | undefined = undefined;
  pages: number[] = [];

  constructor(
    private cityService: CityService
  ) { }

  async ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      this.cities = await this.cityService.getCities(this.page, this.limit);
      this.selectedCity = this.cities.length > 0 ? this.cities[0] : undefined;
      this.initPagination();
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  }

  async onAddCity() {
    try {
      if (!this.cityName) return;
      await this.cityService.createCity(this.cityName);
      this.cityName = '';
      this.loadData();
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    }
  }

  clearAll() {
    this.cityService.clearAllCities();
    this.loadData();
    this.totalPage = 1;
    this.page = 1;
    this.pages = [];
  }

  onClickCity(city: City) {
    this.selectedCity = city;
  }

  onClickPage(selectedPage: number) {
    this.page = selectedPage;
    this.loadData();
  }

  initPagination() {
    const cityCount = this.cityService.getCityCount();
    if (cityCount > 0) {
      this.totalPage = Math.ceil(cityCount/this.limit);
    }
  }
}
