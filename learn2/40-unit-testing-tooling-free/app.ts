import {Component} from '@angular/core';

import {ToCapsPipe, ContainsXPipe, CheckmarkPipe, FieldRangePipe} from './pipes';

@Component({
  selector: 'my-app',
  templateUrl: 'template.html',
  pipes: [ToCapsPipe, ContainsXPipe, CheckmarkPipe, FieldRangePipe]
})
export class AppComponent {
  someNumber: number = 12;
  items: string[] = ['abc', '123', 'xyzabcdef', 'abc123', '8756'];
  paragraph = `This is an example paragraph, here to provide some data on which to operate.
    It is two sentences long, which isn't a lot, but is more than one.`;
  cars = [
    { brand: 'Toyota', year: 2014, color: 'Red' },
    { brand: 'Toyota', year: 2011, color: 'Green' },
    { brand: 'Ford', year: 2005, color: 'Black' },
    { brand: 'Ford', year: 2009, color: 'White' },
    { brand: 'Ford', year: 2013, color: 'Yellow' },
  ];
}
