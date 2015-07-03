/// <reference path="typings/angular2/angular2.d.ts" />
import {Component, EventEmitter, NgFor, NgIf, View, bootstrap} from 'angular2/angular2';

interface HourlyForecast {
  c: string;
  f: string;
  time: string;
  day: string;
  clouds: number;
}

@Component({
  selector: 'city-selector',
  events: ['cityselected']
})
@View({
  template: `
    <div class="city-selector">
      <div class="city-selector-label">Choose a city: {{currentCity}}</div>
      <select name="city" id="city" class="form-control"
          (change)="cityChanged($event)">
        <option *ng-for="#city of cities"
            [selected]="city == currentCity">{{city}}</option>
      </select>
    </div>
  `,
  directives: [NgFor]
})
class CitySelector {
  cities: string[];
  currentCity: string;
  cityselected: any;

  constructor() {
    this.cities = [
      'Berlin',
      'Buenos Aires',
      'Cairo',
      'New York',
      'Sydney',
      'Tokyo'
    ];
    this.currentCity = 'New York';
    this.cityselected = new EventEmitter();
  }

  cityChanged(event) {
    this.currentCity = event.target.value;
    this.cityselected.next();
  }
}

@Component({
  selector: 'weather-card',
  properties: ['forecast']
})
@View({
  template: `
    <div class="weather-card">
      <div>{{forecast.day}} {{forecast.time}}</div>
      <div>
        <i class="wi" [class.wi-day-cloudy]="isCloudy()"
            [class.wi-day-sunny]="isSunny()">
          {{forecast.c}}C / {{forecast.f}}F
        </i>
      </div>
    </div>
  `
})
class WeatherCard {
  forecast: HourlyForecast;

  constructor() {
    this.forecast = null;
  }

  isCloudy(): boolean {
    return this.forecast.clouds > 30;
  }

  isSunny(): boolean {
    return this.forecast.clouds <= 30;
  }
}

class DateAndTime {
  static dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  localTime: string;
  day: string;

  constructor(utcDate: string) {
    var date = new Date(utcDate + ' UTC');
    // Drop the seconds.
    this.localTime = date.toLocaleTimeString().replace(/:00 /, ' ');
    this.day = DateAndTime.dayNames[date.getDay()];
  }
}

@Component({
  selector: 'weather-app'
})
@View({
  template: `
    <div class="weather-app">
      <div>
        <div class="weather-app-city">{{cityName}}</div>
        <city-selector #city
            (cityselected)="cityChanged(city.currentCity)"></city-selector>
      </div>
      <div class="row">
        <div *ng-for="#item of forecastList" class="col-xs-4">
          <weather-card [forecast]="item"></weather-card>
        </div>
      </div>
    </div>
  `,
  directives: [CitySelector, NgFor, WeatherCard]
})
class WeatherApp {
  baseUrl: string;
  forecastList: HourlyForecast[];
  cityName: string;

  constructor() {
    this.baseUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    this.getWeather('New York');
  }

  cityChanged(currentCity: string) {
    this.getWeather(currentCity);
  }

  format(temperature: number): string {
    var stringValue = '' + temperature;
    // Get one digit after the decimal point.
    var index = stringValue.indexOf('.');
    if (index !== -1) {
      stringValue = stringValue.substring(0, index + 2);
    }
    return stringValue;
  }

  toCelsius(kelvin: string): string {
    // Temperature, Kelvin (subtract 273.15 to convert to Celsius)
    var celsius = parseFloat(kelvin) - 273.15;
    return this.format(celsius);
  }

  toFahrenheit(celsius: string): string {
    var fahrenheit = (parseFloat(celsius) * 1.8) + 32.0;
    return this.format(fahrenheit);
  }

  getWeather(currentCity: string) {
    var self = this;
    var request = new XMLHttpRequest();

    request.onload = function handleResponse(response) {
      var weatherData = JSON.parse(request.responseText);
      self.handleResponse(weatherData);
    };
    request.open('GET', this.baseUrl + currentCity, true);
    request.send(null);
  }

  handleResponse(weatherData: any) {
    this.cityName = weatherData.city.name;

    this.forecastList = weatherData.list.map(item => {
      var c = this.toCelsius(item.main.temp);
      var dateAndTime = new DateAndTime(item.dt_txt);

      return {
        c: c,
        f: this.toFahrenheit(c),
        day: dateAndTime.day,
        time: dateAndTime.localTime,
        clouds: parseInt(item.clouds.all, 10)
      };
    });
  }
}

bootstrap(WeatherApp).then(
    success => console.log('success', success),
    failure => console.log('failure', failure)
);
