import {Component} from '@angular/core';

import {BlueCard} from './blue';

@Component({
  selector: 'green-card',
  template: `
    <div class="card green" style="padding: 10px">
      <h4>I am a green card</h4>
      <blue-card></blue-card>
    </div>
  `,
  directives: [BlueCard]
})
export class GreenCard { }
