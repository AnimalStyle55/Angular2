import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

const template = `
<div class="jumbotron text-center">
  <h2 id="welcome-message">Welcome to the Star Wars character creator!</h2>

  <p class="instructions">Click below to get started!</p>
  <a class="btn btn-primary" [routerLink]="['/select']">GO!</a>
</div>
`;

@Component({
  // template: template
  template,
  directives: [ROUTER_DIRECTIVES]
})
export class WelcomeScreen {

}
