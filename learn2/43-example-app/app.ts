import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {Swapi} from './swapi';

@Component({
  selector: 'my-app',
  template: `<router-outlet></router-outlet>`,
  directives: [ROUTER_DIRECTIVES],
  providers: [Swapi]
})
export class AppComponent { }

// TODO: Set the title according to the current route
// $rootScope.title = function() {
//   return $route && $route.current ? $route.current.title : '';
// }
