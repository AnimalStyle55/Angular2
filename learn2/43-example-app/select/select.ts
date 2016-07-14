import {Component} from '@angular/core';
import {Router} from '@angular/router';
import * as _ from 'lodash';

import {NameForm} from './nameForm.ts';
import {FacetedSearch} from './facetedSearch.ts';
import {CardList} from './cardList.ts';

import {Swapi} from '../swapi.ts';

let template = `
<div class="row">
  <div class="col-md-8 col-md-push-2">
    <character-name-form (valid)="setFormValidity($event)" [(name)]="characterName"></character-name-form>
  </div>
</div>
<div class="row">
  <div class="col-md-8 col-md-push-2">
    <div class="character-select">
      <h2>Choose your Archetype</h2>
      <input type="text" placeholder="Search Archetypes" [(ngModel)]="nameFilter">
      <select [(ngModel)]="sortBy">
        <option value="birth_year">Birth Year</option>
        <option value="name">Name</option>
        <option value="height">Height</option>
      </select>
      <faceted-search [(searchFields)]="facets"></faceted-search>
      <character-card-list
          [formValid]="formValid"
          [list]="filteredList(nameFilter, facets, sortBy)"
          (select)="selectArchetype($event)"></character-card-list>
    </div>
  </div>
</div>
`;

@Component({
    template,
    directives: [NameForm, FacetedSearch, CardList]
})
export class SelectScreen {
  fullList: any[];
  facets = {
    'gender': '',
    'race': '',
    'statPref': ''
  };
  nameFilter: string = '';
  sortBy = 'name';
  characterName = '';
  prevFilteredList: any[] = [];

  formValid = false;

  constructor(swapi: Swapi, private router: Router) {
    swapi.getPeople().then(people => {
      this.fullList = people;
    });
  }

  filteredList(nameFilter: string, facets: any, sortBy: string): any[] {
    // We only want the facets with non-null-non-empty filter.
    let nonEmptyFacets = _.pickBy(facets, _.identity);
    // This function is called too many times; check again in a later Beta.
    // console.log("searching", sortBy, nameFilter, facets);
    // Lacking the filter filter, use Array features.

    let curList = _.chain(this.fullList)
      .sortBy(sortBy)
      .filter((x: any) => nameFilter === '' ||
            x.name.toLowerCase().indexOf(nameFilter.toLowerCase()) > -1)
      .filter(nonEmptyFacets)
      .value();
    if (!_.isEqual(this.prevFilteredList, curList)) {
      this.prevFilteredList = curList;
    }
    return this.prevFilteredList;
  }

  setFormValidity(formState: boolean) {
    this.formValid = formState;
  }

  selectArchetype(id: number) {
    this.router.navigateByUrl('/configure/' + id + '/' + this.characterName);
  }
}
