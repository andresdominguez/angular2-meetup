if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
if (typeof __metadata !== "function") __metadata = function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var CitySelector = (function () {
    function CitySelector() {
        this.cities = [
            'Berlin',
            'Buenos Aires',
            'Cairo',
            'New York',
            'Sydney',
            'Tokyo'
        ];
        this.currentCity = 'New York';
        this.cityselected = new angular2_1.EventEmitter();
    }
    CitySelector.prototype.cityChanged = function (event) {
        this.currentCity = event.target.value;
        this.cityselected.next();
    };
    CitySelector = __decorate([
        angular2_1.Component({
            selector: 'city-selector',
            events: ['cityselected']
        }),
        angular2_1.View({
            template: "\n    <div class=\"city-selector\">\n      Choose a city: {{currentCity}}\n      <select name=\"city\" id=\"city\" class=\"form-control\"\n          (change)=\"cityChanged($event)\">\n        <option *for=\"var city of cities\"\n            [selected]=\"city == currentCity\">{{city}}</option>\n      </select>\n    </div>\n  ",
            directives: [angular2_1.For]
        }), 
        __metadata('design:paramtypes', [])
    ], CitySelector);
    return CitySelector;
})();
var WeatherCard = (function () {
    function WeatherCard() {
        this.hourly = {};
    }
    WeatherCard.prototype.celsius = function () {
        return this.hourly.myTemp.c;
    };
    WeatherCard.prototype.fahrenheit = function () {
        return this.hourly.myTemp.f;
    };
    WeatherCard.prototype.time = function () {
        return this.hourly.dateTime.dt;
    };
    WeatherCard = __decorate([
        angular2_1.Component({
            selector: 'weather-card',
            properties: {
                hourly: 'hourly'
            }
        }),
        angular2_1.View({
            template: "\n    <div>\n      <div>C: {{celsius()}}</div>\n      <div>F: {{fahrenheit()}}</div>\n      <div>Time: {{time()}}</div>\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], WeatherCard);
    return WeatherCard;
})();
var DateAndTime = (function () {
    function DateAndTime(utcDate) {
        var date = new Date(utcDate + ' UTC');
        this.localDate = date.toLocaleDateString();
        this.localTime = date.toLocaleTimeString();
        this.dt = this.localDate + ' ' + this.localTime;
    }
    return DateAndTime;
})();
var WeatherApp = (function () {
    function WeatherApp() {
        this.hello = '34ddd5';
        this.url = 'http://api.openweathermap.org/data/2.5/forecast?lat=35&lon=139';
        this.getWeather();
    }
    WeatherApp.prototype.cityChanged = function () {
        console.log('hola');
    };
    WeatherApp.prototype.format = function (temperature) {
        var stringValue = '' + temperature;
        var index = stringValue.indexOf('.');
        if (index !== -1) {
            stringValue = stringValue.substring(0, index + 2);
        }
        return stringValue;
    };
    WeatherApp.prototype.toCelsius = function (kelvin) {
        var celsius = parseFloat(kelvin) - 273.15;
        return this.format(celsius);
    };
    WeatherApp.prototype.toFahrenheit = function (celsius) {
        var fahrenheit = (parseFloat(celsius) * 1.8) + 32.0;
        return this.format(fahrenheit);
    };
    WeatherApp.prototype.getWeather = function () {
        var _this = this;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', this.url, false);
        xmlHttp.send(null);
        var weatherData = JSON.parse(xmlHttp.responseText);
        this.cityName = weatherData.city.name;
        this.weatherList = weatherData.list;
        this.weatherList.forEach(function (item) {
            item.myTemp = {};
            item.myTemp.c = _this.toCelsius(item.main.temp);
            item.myTemp.f = _this.toFahrenheit(item.myTemp.c);
            item.dateTime = new DateAndTime(item.dt_txt);
        });
    };
    WeatherApp = __decorate([
        angular2_1.Component({
            selector: 'weather-app'
        }),
        angular2_1.View({
            template: "\n    <div class=\"row\">\n      <div> {{cityName}} </div>\n      <city-selector (cityselected)=\"cityChanged()\"></city-selector>\n      <div *for=\"var item of weatherList\">\n        <weather-card [hourly]=\"item\"></weather-card>\n      </div>\n    </div>\n  ",
            directives: [CitySelector, angular2_1.For, WeatherCard]
        }), 
        __metadata('design:paramtypes', [])
    ], WeatherApp);
    return WeatherApp;
})();
angular2_1.bootstrap(WeatherApp);
