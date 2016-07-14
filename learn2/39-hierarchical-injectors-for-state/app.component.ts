import { Component } from '@angular/core';

import {CarOrderComponent} from './car-order/car-order.component';
import {CarStateService} from './car-state.service';

@Component({
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [CarOrderComponent]
  // ,providers: [CarStateService]
})
export class AppComponent {
  cars: any[] = [];

  addOne() {
    this.cars.push({});
  }
}
