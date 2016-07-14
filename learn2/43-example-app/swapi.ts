import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {jsonRequestHeaders} from './httpUtils.ts';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

// TODO capture some local data, so that this example
// can be used offline.

@Injectable()
export class Swapi {

  constructor(private http: Http) { }

  private getJson(url: string): Promise<any> {
    return this.http.get(url, jsonRequestHeaders)
      .toPromise(Promise)
      .then(response => response.json());
  }

  getPeople () {
    return this.getJson('http://swapi.co/api/people/')
      .then(response => response.results)
      .then(x => this.addSwappData(x));
  };

  getImageMap () {
    return this.getJson('data/imageMap.json');
  };

  getPerson (id: string) {
    return this.getJson('http://swapi.co/api/people/' + id + '/')
      .then(x => this.processFilmList(x))
      .then(x => this.addImageUrl(x))
      .then(addBaseStats)
      .then(modifyGender);
  };

  processFilmList(character: any) {
    const filmPromises: Promise<any>[] = [];
    _.forEach(character.films, (filmUrl: string) => {
      // In a truly restfull API, sometimes you can just use http,
      // because the API has provided all that you need to know
      filmPromises.push(this.getJson(filmUrl)
        .then((film: any) => film.title)
      );
    });
    return Promise.all(filmPromises).then(function (films) {
      character.filmNames = films;
      return character;
    });
  }

  private addImageUrl(character: any) {
    return this.getImageMap().then(function(map) {
      character.imageUrl = map[character.name];
      return character;
    });
  }

  private addSwappData(characters: any[]) {
    const imagePromises: any[] = [];
    characters.forEach(addBaseStats);
    characters.forEach(addRace);
    characters.forEach(modifyGender);
    characters.forEach(addCharacterId);
    characters.forEach(x => imagePromises.push(this.addImageUrl(x)));
    return Promise.all(imagePromises).then(_ => characters);
  }
}

function addCharacterId(character: any) {
  let urlSegments = character.url.split('/');
  character.id = urlSegments[urlSegments.length - 2];
  return character;
}

// Quick and dirty fix to avoid partial match searches giving inaccurate results
function modifyGender(character: any) {
  character.gender = character.gender[0];
  return character;
}

function addRace(character: any) {
  if (character.gender === 'n/a') {
    character.race = 'droid';
  } else {
    character.race = 'human';
  }
  return character;
}

function addBaseStats(character: any) {
  let minStr = 8,
    minDex = 4;

  character.baseStr = Math.round(minStr + (character.mass + character.height) / 15000);
  character.baseDex = Math.round(minDex + Math.pow(1550000 / (character.mass + character.height), 0.3));
  if (character.baseStr > character.baseDex) {
    character.statPref = 'str';
  } else {
    character.statPref = 'dex';
  }
  return character;
}
