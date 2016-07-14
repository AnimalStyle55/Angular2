import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

import {IShip, MyService} from './my-service';

@Component({
  selector: 'my-app',
  providers: [MyService],
  templateUrl: 'template.html'
})
export class AppComponent implements OnInit {
  ships1: Observable<IShip[]>;
  ships2: Promise<IShip[]>;

  constructor(private api: MyService) { }

  ngOnInit() {
    this.ships1 = this.api.loadShips1();
    this.ships2 = this.api.loadShips2();
  }
}
