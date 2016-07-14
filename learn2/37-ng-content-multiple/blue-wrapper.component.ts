import {Component} from '@angular/core';

@Component({
  selector: 'blue-wrapper',
  styles: [
    '.outer { border: solid blue }',
    '.inner { border: dotted blue }'
  ],
  template: `
  <div class="card outer">
    <h2>
      <ng-content select="heading"></ng-content>
    </h2>
    <div class="card inner">
      <ng-content select="content"></ng-content>
    </div>
  </div>
  `
})
export class BlueWrapperComponent {

}