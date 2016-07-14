import {RouterConfig} from '@angular/router';

import {People} from './people.component';
import {Companies} from './companies.component';

export const CONTACT_ROUTER_CONFIG: RouterConfig = [
    { path: '', redirectTo: 'people', pathMatch: 'full' },
    { path: 'people', component: People },
    { path: 'companies', component: Companies }
];
