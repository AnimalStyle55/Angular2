import {Component} from '@angular/core';
import {YellowCard} from './yellow';

@Component({
  selector: 'blue-card',
  template: `
    <div class="card blue" style="padding: 10px;">
      <h4>I am a blue card</h4>
      <yellow-card></yellow-card>
    </div>
  `,
  directives: [YellowCard]
})
export class BlueCard { }
