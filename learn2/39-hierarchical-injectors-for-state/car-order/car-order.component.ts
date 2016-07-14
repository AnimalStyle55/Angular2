import { Component } from '@angular/core';

import {CarStateService} from '../car-state.service';
import {AxleSelectorComponent} from '../axle-selector/axle-selector.component';
import {WheelSelectorComponent} from '../wheel-selector/wheel-selector.component';
import {ValidityDisplayComponent} from '../validity-display/validity-display.component';

@Component({
  selector: 'car-order',
  templateUrl: 'car-order/car-order.component.html',
  styleUrls: ['car-order/car-order.component.css'],
  directives: [AxleSelectorComponent, WheelSelectorComponent, ValidityDisplayComponent],
  providers: [CarStateService]
})
export class CarOrderComponent { }
