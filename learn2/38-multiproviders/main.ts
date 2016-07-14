import {bootstrap} from '@angular/platform-browser-dynamic';

import {FirstService, SecondService} from './services';
import {AppComponent} from './app';

bootstrap(AppComponent, [
  // Create a bucket of things, analogous to the built in buckets
  { provide: 'foo', useClass: FirstService, multi: true },
  { provide: 'foo', useClass: SecondService, multi: true }
]);
