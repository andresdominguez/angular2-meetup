import {Component,EventEmitter, For, If, View, bootstrap} from 'angular2/angular2';

@Component({
  selector: 'city-selector',
  events: ['cityselected']
})
@View({
  template: `
    <div class="city-selector">
      Choose a city: {{currentCity}}
      <select name="city" id="city" class="form-control"
          (change)="cityChanged($event)">
        <option *for="var city of cities"
            [selected]="city == currentCity">{{city}}</option>
      </select>
    </div>
  `,
  directives: [For]
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
  properties: {
    hourly: 'hourly'
  }
})
@View({
  template: `
    <div>
      <div>C: {{celsius()}}</div>
      <div>F: {{fahrenheit()}}</div>
      <div>Time: {{time()}}</div>
    </div>
  `
})
class WeatherCard {
  hourly: any;

  constructor() {
    this.hourly = {};
  }

  celsius() {
    return this.hourly.myTemp.c;
  }

  fahrenheit() {
    return this.hourly.myTemp.f;
  }

  time() {
    return this.hourly.dateTime.dt
  }
}

class DateAndTime {
  localDate: string;
  localTime: string;
  dt: string;

  constructor(utcDate: string) {
    var date = new Date(utcDate + ' UTC');
    this.localDate = date.toLocaleDateString();
    this.localTime = date.toLocaleTimeString();
    this.dt = this.localDate + ' ' + this.localTime;
  }
}

@Component({
  selector: 'weather-app'
})
@View({
  template: `
    <div class="row">
      <div> {{cityName}} </div>
      <city-selector (cityselected)="cityChanged()"></city-selector>
      <div *for="var item of weatherList">
        <weather-card [hourly]="item"></weather-card>
      </div>
    </div>
  `,
  directives: [CitySelector, For, WeatherCard]
})
class WeatherApp {
  hello: string;
  url: string;
  weatherList: any[];
  cityName: string;

  constructor() {
    this.hello = '34ddd5';
    this.url = 'http://api.openweathermap.org/data/2.5/forecast?lat=35&lon=139';
    this.getWeather();
  }

  cityChanged() {
    console.log('hola');
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

  getWeather() {
    var self = this;
    var request = new XMLHttpRequest();

    request.onload = function handleResponse(response) {
      var weatherData = JSON.parse(request.responseText);
      self.handleResponse(weatherData);
    };
    request.open('GET', this.url, true);
    request.send(null);
  }

  handleResponse(weatherData: any) {
    this.cityName = weatherData.city.name;
    this.weatherList = weatherData.list;

    this.weatherList.forEach(item => {
      item.myTemp = {};

      item.myTemp.c = this.toCelsius(item.main.temp);
      item.myTemp.f = this.toFahrenheit(item.myTemp.c);
      item.dateTime = new DateAndTime(item.dt_txt);
    });
  }
}

bootstrap(WeatherApp);
