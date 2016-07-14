import {PLATFORM_DIRECTIVES} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';

import {WidelyUsedComponent} from './widelyUsedComponent';
import {AppComponent} from './app';

bootstrap(AppComponent, [
  // Add our component to the built in bucket of widely used componenets
  // TODO This API is being phased out and replaced as of rc.2
  { provide: PLATFORM_DIRECTIVES, useValue: WidelyUsedComponent, multi: true}
]);
