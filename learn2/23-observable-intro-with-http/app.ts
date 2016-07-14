import {Component} from '@angular/core';
import {Http, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';

@Component({
  selector: 'my-app',
  templateUrl: './template.html'
})
export class AppComponent {
  phones: {}[];

  constructor(http: Http) {
    // Try these one at a time:
    this.getAndSubscribe(http);
    // this.exampleOfDo(http);
    // this.subscribeTwice(http);
    // this.share(http);
  }

  getAndSubscribe(http: Http) {
    // Verbose code to show the type explicitly:
    http.get('../demo-data/phones.json')
      // Call map on the response observable to get the parsed phones object
      .map((res: Response) => res.json())  // 'parse as JSON'
      // Subscribe to the observable to get the parsed phones object
      // and attach it to the component.
      // If you don't subscribe, nothing will happen.
      .subscribe((d: {}[]) => {
        this.phones = d;
        console.log(d);
      });
  }

  exampleOfDo(http: Http) {
    http.get('../demo-data/phones.json')
      // do() call a function for side effects, and returns the original Observable.
      .do((d: Response) => console.log('raw data', d))
      .map((res: Response) => res.json())
      .do((d: any) => console.log('processed data', d))
      .subscribe((data: {}[]) => this.phones = data);
  }

  subscribeTwice(http: Http) {
    let ob1$ = http.get('../demo-data/phones.json')
      // do() calls a function for side effects, and returns the original Observable.
      .do((d: Response) => console.log('do', d))
      .map((res: Response) => res.json());

    // If you don't subscribe ('pull'), nothing will happen.
    ob1$.subscribe((data: {}[]) => {
      console.log('1');
      this.phones = data;
    });

    // If you subscribe twice, it will run twice (!)
    ob1$.subscribe((data: {}[]) => {
      console.log('2');
      this.phones = data;
    });
  }

  share(http: Http) {
    let ob2$ = http.get('../demo-data/phones.json')
      .do((d: Response) => console.log('do', d))
      .map((res: Response) => res.json())
      .share(); // This does reference counting.

    ob2$.subscribe((data: {}[]) => {
      console.log('1');
      this.phones = data;
    });

    ob2$.subscribe((data: {}[]) => {
      console.log('2');
      this.phones = data;
    });
  }
}
