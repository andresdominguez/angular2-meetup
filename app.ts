import {Component, View, bootstrap} from 'angular2/angular2';

@Component({
	selector: 'hello'	
})
@View({
	template: '<div> {{hello}} </div>'
})
class HelloComponent {
	hello: string;
	
	constructor() {
		this.hello = '34ddd5';
	}
}

bootstrap(HelloComponent);
