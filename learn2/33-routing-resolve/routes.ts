import {provideRouter, RouterConfig} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {Welcome} from './welcome';
import {Companies} from './companies.component';
import {CompanyListRetriever} from './data';

const routes: RouterConfig = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: Welcome },
  { path: 'companies', component: Companies,
    resolve: { companies: CompanyListRetriever } }
];

export const ROUTE_PROVIDERS = [
  CompanyListRetriever,
  provideRouter(routes),
  { provide: LocationStrategy, useClass: HashLocationStrategy }
];
