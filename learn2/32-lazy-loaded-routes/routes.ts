import {provideRouter, RouterConfig} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

// Note there is no import of the NameComponent or reference to './nameComponent'.

import {HomeComponent} from './home.component';

// We rely on System being present until the browser has a solid native module
// loading system. Since this is loaded directly we are going to tell TS to
// assume that it is available for our use.
declare var System: any;

const routes: RouterConfig = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  // This has not landed yet, but in the next rc should just work
  // https://plnkr.co/edit/87IFYUaAZPZhZlxocuF1?p=preview
  { path: 'hello/:who', component: './name.component#NameComponent'}
];

export const ROUTE_PROVIDERS = [
  provideRouter(routes),
  { provide: LocationStrategy, useClass: HashLocationStrategy }
];
