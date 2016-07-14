import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {CarStateService} from '../car-state.service';

@Component({
  selector: 'validity-display',
  templateUrl: 'validity-display/validity-display.component.html',
  styleUrls: ['validity-display/validity-display.component.css']
})
export class ValidityDisplayComponent implements OnInit {

  ok$: Observable<boolean>;
  message$: Observable<string>;

  constructor(private carStateService: CarStateService) { }

  ngOnInit() {
    this.ok$ = this.carStateService.state$.map(
      carState => carState.ok
    );
    this.message$ = this.carStateService.state$.map(
      carState => carState.message ? carState.message : 'ok!'
    );
  }

}
