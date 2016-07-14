import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  selector: 'my-app',
  template: `
    <div>
      <a [routerLink]="['home']">home</a>
      <a [routerLink]="['hello', 'Brian']">hello</a>
      <hr>
      <div>header could be here</div>
      <router-outlet></router-outlet>
      <div>footer could be here</div>
    </div>
  `,
  directives: ROUTER_DIRECTIVES
})
export class App {
}
