import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {ICompany} from './company';

@Component({
  templateUrl: './companies.component.html'
})
export class Companies {
  companies$: Observable<ICompany[]>;

  constructor(ar: ActivatedRoute) {
    // String here has to match the string in the resolve config of your route
    this.companies$ = ar.data.map(d => d['companies']);
  }
}
