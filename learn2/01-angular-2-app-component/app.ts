import {Component} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';

@Component({
  selector: 'my-app',
  template: '<h1>My First TypeScript Angular 2 App</h1>'
})
class AppComponent {
  // OK to have no code in a component.
}

// Bootstrap the Angular application.
// This is NOT the bootstrap.css framework.
bootstrap(AppComponent);
