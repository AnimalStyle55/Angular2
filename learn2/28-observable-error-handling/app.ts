import {Component} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'my-app',
  template: `
    <h3>Phones</h3>
    <ul>
      <li *ngFor="let p of phones">
        {{p.name}}
      </li>
    </ul>
  `
})
export class AppComponent {
  phones: any[];

  constructor(http: Http) {
    this.getAndSubscribe(http);
  }

  getAndSubscribe(http: Http) {
    http.get('../demo-data/xphones.json')
      .map((res: Response) => res.json())
      .catch((err) => {
        console.error('handling error', err);
        const fakeData = [{ name: 'no phone' }];
        return Observable.of(fakeData);
      })
      .subscribe((data: any) => {
        console.log('Data arrived', data);
        this.phones = data;
      });
  }
}

// .retry()
