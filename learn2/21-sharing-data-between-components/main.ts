import {bootstrap} from '@angular/platform-browser-dynamic';

import {AppComponent} from './app';
import {SharedData} from './sharedData';

// This is how you provide a single instance
// across the application:
bootstrap(AppComponent, [SharedData]);
