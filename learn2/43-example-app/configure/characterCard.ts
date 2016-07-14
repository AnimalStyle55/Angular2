import {Component, Input, Output} from '@angular/core';
import {StringCentimetersToNumberFeetPipe, RoundToPipe} from './../formatPipes';

let template = `
<div *ngIf="character" class="panel panel-default">
  <div class="panel-heading character-card-heading text-center">
    {{character.avatarName}}
  </div>
  <div class="panel-body text-center">
    <img class="meme" [src]="character.imageUrl">
    <dl class="dl-horizontal">
      <hr>
      <dt>Archetype:</dt>
      <dd>{{character.name}}</dd>
      <hr>
      <dt>Height:</dt>
      <dd>{{character.height | stringCentimetersToNumberFeet | roundTo:1}} ft.</dd>
      <hr>
      <dt>Strength:</dt>
      <dd>{{str}}</dd>
      <hr>
      <dt>Dexterity:</dt>
      <dd>{{dex}}</dd>
      <hr>
      <dt>Gender:</dt>
      <dd>{{character.gender}}</dd>
      <hr>
      <dt>Appearances:</dt>
      <dd *ngFor="let film of character.filmNames">{{film}}</dd>
    </dl>
  </div>
</div>
`;

@Component({
  selector: 'character-card',
  template,
  pipes: [StringCentimetersToNumberFeetPipe, RoundToPipe]
})
export class CharacterCard {
  @Input()
  character: any;
  @Input()
  str: number;
  @Input()
  dex: number;
}
