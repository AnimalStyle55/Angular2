// This component displays a single entry from Firebase on the screen.

import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

declare var Firebase: any;

import {fbName} from './fbConfig.ts';
import {observableFirebaseObject} from 'angular2-firebase';

@Component({
  selector: 'one-person',
  template: `
  <div>
    <b>Person {{id}}:</b>
    <p>{{ person$ | async | json }}</p>
    <p>{{ (person$ | async)?.name}}</p>
  </div>
  `
})
export class OnePerson implements OnInit {
  @Input() id: string;
  person$: Observable<any>;

  ngOnInit() {
    // This can't be called in the constructor because the properties
    // from the parent template are not yet populated.
    this.person$ = observableFirebaseObject(new Firebase(fbName)
      .child("stuff")
      .child("cat1")
      .child(this.id));
  }
}
