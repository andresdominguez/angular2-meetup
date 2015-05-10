import {Component, For, View, bootstrap} from 'angular2/angular2';

@Component({
  selector: 'weather-card'
})
@View({
  template: '<div>a</div>'
})
class WeatherCard {
  hourly: any;

  constructor() {
    this.hourly = {};
  }

  //yo() {
  //  debugger;
  //  return this.hourly.main.celsius;
  //}
}


@Component({
  selector: 'hello'
})
@View({
  template: `
    <div>
      <div> {{cityName}}  </div>
      <div *for="var item of weatherList">
      <weather-card></weather-card>
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
      item.main.celsius = parseFloat(item.main.temp) - 273.15;
      console.log('item.main.celsius', item.main.celsius);
    });
  }
}

bootstrap(HelloComponent);
