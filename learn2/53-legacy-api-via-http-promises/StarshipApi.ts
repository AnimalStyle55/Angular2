import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

import {jsonRequestHeaders} from "./httpUtils";

@Injectable()
export class StarshipApi {
  constructor(private http: Http) {
  }

  loadStarships(): Promise<any> {
    return this.http.get("http://swapi.co/api/starships/", jsonRequestHeaders)
      .toPromise(Promise)
      .then(response => response.json())
      .then(shipList => {  // Promise-based APIs still work fine:
        console.log("Ship list retrieved, GETting film data", shipList);
        return Promise.all(
          shipList.results.map((ship: any) => {
            console.log("GETting film data for " + ship.name);
            return this.http.get(ship.films[0], jsonRequestHeaders)
              .toPromise(Promise)
              .then(response => response.json())
              .then((film) => {
                // console.log(film);
                ship.filmName = film.title;
                return ship;
              });
          })
        );
      });
  }
}
