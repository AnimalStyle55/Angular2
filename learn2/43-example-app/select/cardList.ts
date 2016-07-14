import {Component, Input, EventEmitter, Output} from '@angular/core';

import {Card} from './card.ts';

let template = `
  <div class="flex-container">
      <character-card [archetype]="character"
        (action)="choose(character.id)"
        [enabled]="formValid"
        *ngFor="let character of list" class="archetype-panel"></character-card>
  </div>
`;

@Component({
  selector: 'character-card-list',
  template,
  directives: [Card]
})
export class CardList {
  @Input()
  list: any[] = [];

  @Input()
  formValid: boolean = false;

  @Output()
  select = new EventEmitter();

  choose(id: number) {
    this.select.emit(id)
  }
}
