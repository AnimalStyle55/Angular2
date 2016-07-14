import {bootstrap} from '@angular/platform-browser-dynamic';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import {HTTP_PROVIDERS} from '@angular/http';

import {AppComponent} from './app';

bootstrap(AppComponent, [
  disableDeprecatedForms(),
  provideForms(),
  HTTP_PROVIDERS]);
