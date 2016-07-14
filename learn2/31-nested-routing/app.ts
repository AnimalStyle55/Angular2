import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';

import {NavBar} from './nav.component';

@Component({
  selector: 'my-app',
  template: `
    <nav-bar></nav-bar>
    <router-outlet></router-outlet>
    <footer>
      <hr>
      <p>footer goes here.</p>
    </footer>
  `,
  directives: [ROUTER_DIRECTIVES, NavBar],
  providers: [Title]
})
export class AppComponent {
  constructor(router: Router, title: Title) {
    // router.changes.subscribe(() => {
    //   // fires on every URL change
    //   title.setTitle(router.serializeUrl(router.urlTree));
    // });
  }
}
