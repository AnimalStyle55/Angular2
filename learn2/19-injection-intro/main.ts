import {bootstrap} from '@angular/platform-browser-dynamic';

import {GreetingCalculator} from './greetingCalculator';
import {ShippingMethods} from './shippingMethods';
import {AppComponent} from './app';

bootstrap(AppComponent, [
  GreetingCalculator,
  ShippingMethods
]);
