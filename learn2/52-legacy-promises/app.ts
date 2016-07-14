import {Component} from "@angular/core";
import {Http, Response} from "@angular/http";

import "rxjs/add/operator/toPromise";

import {jsonRequestHeaders} from "./httpUtils";

interface ISwapiStarShipResponse {
  results: {}[];
}

// This special jsonRequestHeaders setting is needed with Firefox,
// but Chrome does the right thing with or without it.

@Component({
  selector: "my-app",
  template: `
    <h3>Starships</h3>
    <ul>
      <li *ngFor="let s of starships">{{s.name}}</li>
    </ul>
  `
})
export class AppComponent {
  starships: {}[];
  // Note that index.html changed to include http

  constructor(http: Http) {
    // If you are using HTTP in this trivial one-shot way, it is
    // reasonable to convert to a Promise, if you prefer:
    http.get("http://swapi.co/api/starships/", jsonRequestHeaders)
      .toPromise(Promise)   // Caveat - no way to unsubcribe the Observable.
      .then((res: Response) => res.json())
      .then((data: ISwapiStarShipResponse) => {
        console.log(data);
        // throw ("broke on purpose");
        return data;
      })
      .then((data: ISwapiStarShipResponse) => this.starships = data.results)
      .catch(console.error);
  }
}
