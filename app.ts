import {Component, If, For, View, bootstrap} from 'angular2/angular2';

@Component({
  selector: 'city-selector'
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
  }

  cityChanged(event) {
    this.currentCity = event.target.value;
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
      <span>Time: {{time()}}</span>
      <span>C: {{celsius()}}</span>
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
    return this.hourly.dt_txt;
  }
}


@Component({
  selector: 'weather-app'
})
@View({
  template: `
    <div>
      <div> {{cityName}}  </div>
      <city-selector></city-selector>
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

  getWeather() {
    return;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', this.url, false);
    xmlHttp.send(null);

    var weatherData = JSON.parse(xmlHttp.responseText);

    this.cityName = weatherData.city.name;
    this.weatherList = weatherData.list;

    this.weatherList.forEach(item => {
      // Temperature, Kelvin (subtract 273.15 to convert to Celsius)
      var main = item.main;

      var celsius = '' + (parseFloat(main.temp) - 273.15);

      // Get one digit after the decimal point.
      var index = celsius.indexOf('.');
      if (index !== -1) {
        celsius = celsius.substring(0, index + 2);
      }

      main.celsius = celsius;
    });
  }
}

bootstrap(WeatherApp);
