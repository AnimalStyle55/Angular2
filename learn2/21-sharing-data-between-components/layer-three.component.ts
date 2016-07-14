import {Component} from '@angular/core';
import {SharedData} from './sharedData';

@Component({
  selector: 'layer-three',
  templateUrl: 'layer-three.component.html'
})
export class LayerThree {
  unsharedValue: number = 0;

  constructor(public shared: SharedData) { }

  incUnshared() {
    this.unsharedValue++;
  }
}
