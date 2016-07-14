import {Component} from '@angular/core';
import {Http} from '@angular/http';

import "rxjs/add/operator/toPromise.js";

@Component({
  selector: "list-of-stuff",
  template: require('./list.html')
})
export class ListComponent {
  workers: any;

  // This is injection:
  constructor(http: Http) {
    this.loadData(http);
  }

  // This is not injection:
  loadData(http: Http) {
    // If you are using HTTP in this trivial one-shot way, it is
    // reasonable to convert to a Promise, if you prefer:
    http.get("workers.json")
      // TODO in upcoming alphas, we will need to use
      // ObservableWrapper for this.
      .toPromise(Promise)
      .then((res: any) => res.json())
      .then((data: any) => this.workers = data)
      .then((data: any) => {
        console.log(data);
        // throw ('broke on purpose');
        return data;
      })
      .catch(console.error);
  }
}
