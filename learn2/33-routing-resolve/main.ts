import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';

import {ROUTE_PROVIDERS} from './routes';
import {AppComponent} from './app';
import {CompanyListRetriever} from './data';

bootstrap(AppComponent, [
  ROUTE_PROVIDERS,
  CompanyListRetriever,
  HTTP_PROVIDERS
]);
