import {Component} from "@angular/core";

import {StarshipApi} from "./StarshipApi";

import "rxjs/add/operator/toPromise";

@Component({
  selector: "my-app",
  providers: [StarshipApi],
  templateUrl: "template.html"
})
export class AppComponent {
  starships: any[];

  constructor(api: StarshipApi) {
    api.loadStarships()
      .then((data: any) => this.starships = data);
  }
}
