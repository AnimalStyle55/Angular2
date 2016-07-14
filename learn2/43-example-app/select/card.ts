import {Component, Input, Output, EventEmitter} from '@angular/core';

import {StringCentimetersToNumberFeetPipe, RoundToPipe} from '../formatPipes.ts';

let template = `
<div>
  <h3>{{archetype.name}}</h3>
  <a [ngClass]="{'disabled': !enabled}" (click)="enabled && select()">
    <img class="meme" [src]="archetype.imageUrl">
  </a>
  <dl class="dl-horizontal">
    <dt>Born:</dt>
    <dd>{{archetype.birth_year}}</dd>
    <dt>Height:</dt>
    <dd>{{archetype.height | stringCentimetersToNumberFeet | roundTo:1}} ft.</dd>
    <dt>Mass:</dt>
    <dd>{{archetype.mass}} kg</dd>
    <dt>Strength:</dt>
    <dd>{{archetype.baseStr}}</dd>
    <dt>Dexterity:</dt>
    <dd>{{archetype.baseDex}}</dd>
    <dt>Hair Color</dt>
    <dd>{{archetype.hair_color}}</dd>
  </dl>
  <div class="text-center">
    <button (click)="enabled && select()" [disabled]="!enabled" class="btn btn-default">
      <a>Choose</a>
    </button>
  </div>
</div>
`;

@Component({
  selector: 'character-card',
  template,
  pipes: [StringCentimetersToNumberFeetPipe, RoundToPipe]
})
export class Card {
  @Input()
  archetype: any;

  @Input()
  enabled: boolean;

  @Output()
  action = new EventEmitter();

  select() {
    this.action.emit(this.archetype.id);
  }
}
