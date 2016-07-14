import {bootstrap} from '@angular/platform-browser-dynamic';
import {provideRouter, RouterConfig} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {AppComponent} from './app.component';
import {HomeComponent} from './home.component';
import {NameComponent} from './name.component';

const routes: RouterConfig = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'hello/:who', component: NameComponent }
];

// Example of hash route
// http://example.com/#/product/12

// Example of HTML5 route
// http://example.com/product/12

// base-href must be set either in the index.html, or via
// code; here is an older way to do this:
//   bind(APP_BASE_HREF).toValue(location.pathname)]);
// HTML5 routes can be demonstrated with live-server --entry-file=index.html

bootstrap(AppComponent, [
  provideRouter(routes),
  { provide: LocationStrategy, useClass: HashLocationStrategy }
]);
