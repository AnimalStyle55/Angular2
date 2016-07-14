import {Component} from '@angular/core';

import {Anakin} from './anakin';

// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/do';
// use to import all of rxjs
import 'rxjs/Rx';

@Component({
  selector: 'my-app',
  template: `
    <anakin></anakin>
  `,
  directives: [Anakin]
})
export class AppComponent {

}
