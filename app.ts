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
    <div class="hour-card col-md-1">
      <div class="col-md-1">C: {{celsius()}}</div>
      <div class="col-md-1">Time: {{time()}}</div>
    </div>
  `
})
class WeatherCard {
  hourly: any;

  constructor() {
    this.hourly = {};
  }

  celsius() {
    //debugger;
    return this.hourly.main.celsius;
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
    <div>
      <div> {{cityName}}  </div>
      <city-selector (cityselected)="cityChanged()"></city-selector>
      <div *for="var item of weatherList">
      <div class="row"><weather-card [hourly]="item"></weather-card></div>
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
    debugger;
    console.log('hola');
  }

  toCelsius(kelvin: string): string {
    // Temperature, Kelvin (subtract 273.15 to convert to Celsius)
    var celsius = '' + (parseFloat(kelvin) - 273.15);

    // Get one digit after the decimal point.
    var index = celsius.indexOf('.');
    if (index !== -1) {
      celsius = celsius.substring(0, index + 2);
    }

    return celsius;
  }

  getWeather() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', this.url, false);
    xmlHttp.send(null);

    var weatherData = JSON.parse(xmlHttp.responseText);

    this.cityName = weatherData.city.name;
    this.weatherList = weatherData.list;

    this.weatherList.forEach(item => {
      item.main.celsius = this.toCelsius(item.main.temp);
      item.dateTime = new DateAndTime(item.dt_txt);
    });
  }
}

bootstrap(WeatherApp);
