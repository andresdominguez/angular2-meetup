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
    }
    CitySelector.prototype.cityChanged = function (event) {
        this.currentCity = event.target.value;
    };
    CitySelector = __decorate([
        angular2_1.Component({
            selector: 'city-selector'
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
        return this.hourly.main.celsius;
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
            template: "\n    <div>\n      <span>Time: {{time()}}</span>\n      <span>C: {{celsius()}}</span>\n    </div>\n  "
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
    WeatherApp.prototype.toCelsius = function (kelvin) {
        var celsius = '' + (parseFloat(kelvin) - 273.15);
        var index = celsius.indexOf('.');
        if (index !== -1) {
            celsius = celsius.substring(0, index + 2);
        }
        return celsius;
    };
    WeatherApp.prototype.toLocalDateTime = function (utcDateTime) {
        var date = new Date(utcDateTime + ' UTC');
        return date.toLocaleDateString() + ' -> ' + date.toLocaleTimeString();
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
            item.main.celsius = _this.toCelsius(item.main.temp);
            item.dateTime = new DateAndTime(item.dt_txt);
        });
    };
    WeatherApp = __decorate([
        angular2_1.Component({
            selector: 'weather-app'
        }),
        angular2_1.View({
            template: "\n    <div>\n      <div> {{cityName}}  </div>\n      <city-selector></city-selector>\n      <div *for=\"var item of weatherList\">\n      <weather-card [hourly]=\"item\"></weather-card>\n      </div>\n    </div>\n  ",
            directives: [CitySelector, angular2_1.For, WeatherCard]
        }), 
        __metadata('design:paramtypes', [])
    ], WeatherApp);
    return WeatherApp;
})();
angular2_1.bootstrap(WeatherApp);
