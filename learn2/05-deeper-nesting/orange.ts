import {Component} from '@angular/core';
import {RedCard} from './red';

@Component({
    selector: 'orange-card',
    template: `
    <div class="orange blue" style="padding: 10px;">
      <h4>I am a orange card</h4>
      <red-card></red-card>
    </div>
  `,
    directives: [RedCard]
})
export class OrangeCard { }
