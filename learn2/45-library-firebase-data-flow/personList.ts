// Most notably here, there is nothing necessary to unsubscribe from the
// Firebase events. That is all handled using the observable, via the template
// and the async pipe.

import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {observableFirebaseArray} from 'angular2-firebase';

declare var Firebase: any;

import {fbName} from './fbConfig.ts';

@Component({
  selector: 'person-list',
  template: `
  <h1>Person List</h1>
  <ul>
    <li *ngFor="let p of people | async">
    {{p["$$fbKey"]}} / {{p.name}} / {{p.score}}
    </li>
  </ul>
  `
})
export class PersonList {
  people: Observable<any[]>;

  constructor() {
    this.people = observableFirebaseArray(
      new Firebase(fbName)
        .child("stuff")
        .child("cat1")
        .orderByChild("name")
        .limitToFirst(6)
      ).debounceTime(100);
  }
}
