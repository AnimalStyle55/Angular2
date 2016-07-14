import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';

import {jsonRequestHeaders} from './httpUtils';

@Injectable()
export class StarshipApi {
  constructor(private http: Http) {
  }

  starships(): Observable<any[]> {
    return this.http.get('http://swapi.co/api/starships/', jsonRequestHeaders)
      // parse response as JSON
      .map(response => response.json())
      // extract results field
      .map(shipWrapper => shipWrapper.results)
      // Observable series of ships, rather than single array
      .flatMap((ships: any) => Observable.from(ships, null)) // emit one at a time
      .concatMap((ship: any) => {  // gather them back up
        console.log('GETting film data for ' + ship.name);
        return this.http.get(ship.films[0], jsonRequestHeaders)
          .map(response => response.json())
          .map((film) => {
            ship.filmName = film.title;
            return ship;
          });
      })
      .toArray();
  }
}
