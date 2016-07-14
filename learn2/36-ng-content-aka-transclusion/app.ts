import {Component} from '@angular/core';

@Component({
  selector: 'wrapper',
  template: `
  <div class="card">
    <div class="card-content">
      <div class="card-title">I wrap content</div>
      <ng-content></ng-content>
    </div>
  </div>
  `
})
class WrapperComponent {

}

@Component({
  selector: 'my-app',
  template: `
    <wrapper>
      <p>
        This is a p tag. Its only job is to be transcluded into the wrapper directive.
      </p>
    </wrapper>
  `,
  directives: [WrapperComponent]
})
export class AppComponent { }
