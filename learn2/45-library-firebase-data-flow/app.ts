import {Component} from '@angular/core';

import "rxjs/Rx";

import {ActivityPanel} from './activityPanel.ts';
import {PersonList} from './personList.ts';
import {OnePerson} from './onePerson.ts';

var template = `
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-4">
        <person-list></person-list>
      </div>
      <div class="col-md-4">
        <one-person [id]="'id2001'"></one-person>
        <one-person [id]="'id2002'"></one-person>
        <one-person [id]="'id2003'"></one-person>
        <one-person [id]="'id2004'"></one-person>
        <one-person [id]="'id2005'"></one-person>
        <one-person [id]="'id2006'"></one-person>
      </div>
      <div class="col-md-4">
        <activity-generator></activity-generator>
      </div>
    </div>
  </div>
`;

@Component({
  selector: 'my-app',
  template: template,
  directives: [ActivityPanel, PersonList, OnePerson]
})
export class AppComponent {
}
