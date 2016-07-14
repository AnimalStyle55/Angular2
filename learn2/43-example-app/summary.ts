import {Component} from '@angular/core';

import {CharacterCard} from './configure/characterCard';
import {Swapi} from './swapi';

let template = `
<div class="row">
  <div class="col-md-4 col-md-push-4">
    <character-card [character]="character" [dex]="calcDex()" [str]="calcStr()"></character-card>
  </div>
</div>
<button class="btn btn-primary pull-right" disabled="true">Start Playing</button>
`;

@Component({
  template,
  directives: [CharacterCard]
})
export class SummaryScreen {
  character: any;
  constructor(swapi: Swapi) {
    this.character = JSON.parse(localStorage.getItem('characterObject'));
    swapi.processFilmList(this.character);
  }
  calcStr() {
    return this.character.baseStr + parseInt(this.character.userStats.additionalStrength);
  }
  calcDex() {
    return this.character.baseDex + parseInt(this.character.userStats.additionalDexterity);
  }
}
