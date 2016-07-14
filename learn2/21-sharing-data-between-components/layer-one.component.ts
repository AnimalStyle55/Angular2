import {Component} from '@angular/core';

import {LayerTwo} from './layer-two.component';

@Component({
  selector: 'layer-one',
  template: `
    <div class='card'>
      <div class='card-content'>
        <div class='card-title'>Layer 1 Component: </div>
        <layer-two></layer-two>
      </div>
    </div>`,
  directives: [LayerTwo]
})
export class LayerOne { }
