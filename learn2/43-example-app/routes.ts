import {provideRouter, RouterConfig} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {WelcomeScreen} from './welcome';
import {SelectScreen} from './select/select';
import {ConfigureScreen} from './configure/configure';
import {SummaryScreen} from './summary';

const routes: RouterConfig = [
  { path: '', component: WelcomeScreen, pathMatch: 'full' },
  { path: 'select', component: SelectScreen },
  { path: 'configure/:id/:avatarName', component: ConfigureScreen },
  { path: 'summary', component: SummaryScreen }
];

export const ROUTE_PROVIDERS = [
  provideRouter(routes),
  { provide: LocationStrategy, useClass: HashLocationStrategy }
];
