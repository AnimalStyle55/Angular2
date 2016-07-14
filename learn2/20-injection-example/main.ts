import {bootstrap} from '@angular/platform-browser-dynamic';

import {OrderService} from './orderService';
import {GreetingCalculator} from './greetingCalculator';
import {AppComponent} from './app';

// This is how you provide a single instance
// across the application:
bootstrap(AppComponent, [
  GreetingCalculator,
  { provide: OrderService, useFactory: () => new OrderService(false) }
]);

// You could provide ShippingMethods here also.
