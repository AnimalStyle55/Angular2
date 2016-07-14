import {Component} from '@angular/core';

import {LayerThree} from './layer-three.component';

@Component({
  selector: 'layer-two',
  template: `
    <div class="card">
      <div class="card-content">
        <div class="card-title">Layer 2 Component: </div>
        <layer-three></layer-three>
      </div>
    </div>`,
  directives: [LayerThree]
})
export class LayerTwo { }
