import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';

import {AppComponent} from './app';
import {ROUTE_PROVIDERS} from './routes';

bootstrap(AppComponent, [
  ROUTE_PROVIDERS,
  HTTP_PROVIDERS
]);
