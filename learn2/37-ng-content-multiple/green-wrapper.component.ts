import {Component} from '@angular/core';

@Component({
  selector: 'green-wrapper',
  styles: ['.card { border: solid green }'],
  template: `
  <div class="card">
    <ng-content select="[header]"></ng-content>
    <ng-content select="[body]"></ng-content>
  </div>
  `
})
export class GreenWrapperComponent {

}
