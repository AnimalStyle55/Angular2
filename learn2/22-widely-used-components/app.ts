import {Component} from '@angular/core';

// WidelyUsedComponent is not imported

@Component({
  selector: 'my-app',
  template: `
    <widely-used-component></widely-used-component>
  `
  // Note the lack of directives: also.
})
export class AppComponent { }
