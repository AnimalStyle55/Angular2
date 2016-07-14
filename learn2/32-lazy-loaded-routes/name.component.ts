import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  template: `
    <h2>Hello {{message$ | async}}!</h2>
    <p>I am a sample component, loaded asyncronously.</p>
  `
})
export class NameComponent {
  private message$: Observable<string>;

  constructor(route: ActivatedRoute) {
    this.message$ = route.params.map(p => p['who']);
  }
}

console.log('nameComponent.ts has been loaded.');
