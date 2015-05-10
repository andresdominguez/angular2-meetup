import {Component, For, View, bootstrap} from 'angular2/angular2';

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
  selector: 'hello'
})
@View({
  template: `
    <div>
      <div> {{cityName}}  </div>
      <div *for="var item of weatherList">
      <weather-card [hourly]="item"></weather-card>
      </div>
    </div>
  `,
  directives: [For, WeatherCard]
})
class HelloComponent {
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

bootstrap(HelloComponent);
