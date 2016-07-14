import {provideRouter, RouterConfig} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {Welcome} from './welcome';
import {Contacts} from './contact-manager/contacts.component';
import {CONTACT_ROUTER_CONFIG} from './contact-manager/routes';

const routes: RouterConfig = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: Welcome },
  { path: 'contacts', component: Contacts, children: CONTACT_ROUTER_CONFIG }
];

export const ROUTE_PROVIDERS = [
  provideRouter(routes),
  { provide: LocationStrategy, useClass: HashLocationStrategy }
];
