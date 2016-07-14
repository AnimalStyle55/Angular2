import {Component} from '@angular/core';

import {GreenWrapperComponent} from './green-wrapper.component';
import {BlueWrapperComponent} from './blue-wrapper.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  directives: [GreenWrapperComponent, BlueWrapperComponent]
})
export class AppComponent {

}
