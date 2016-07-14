import {Component} from '@angular/core';

import {OrangeCard} from './orange';
import {GreenCard} from './green';

@Component({
  selector: 'my-app',
  template: `
    <h4>Example application showing component nesting</h4>
    <orange-card></red-card>
    <green-card></green-card>
  `,
  directives: [OrangeCard, GreenCard]
})
export class AppComponent { }
