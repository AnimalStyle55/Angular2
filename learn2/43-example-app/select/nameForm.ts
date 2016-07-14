import {Component, Input, Output, EventEmitter} from '@angular/core';

import {ControlGroup, Control, Validators} from '@angular/common';

let template = `
<h2>Name your Character</h2>
<form [ngFormModel]="characterForm" novalidate>
  <input type="text" placeholder="Character Name" ngControl="name" (ngModelChange)="nameChange.emit($event)">
  <div *ngIf="(characterForm.controls.name.dirty || characterForm.controls.name.touched)
        && characterForm.controls.name.errors?.required">
      A character name is required
  </div>
</form>
`;

@Component({
  selector: 'character-name-form',
  template
})
export class NameForm {
  @Input()
  name: string;
  @Output()
  nameChange: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  valid: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Form object
  characterForm: ControlGroup;

  constructor() {
    //Setup the form object configuration
    let nameControl = new Control("",
      Validators.compose([Validators.required, Validators.minLength(3)]));
    //Docs say this works, but it doesn't seem to?
    // loginControl.registerOnChange(() => {
    //   console.log('Login input changed');
    // });
    this.characterForm = new ControlGroup({
      name: nameControl
    });

    this.characterForm.statusChanges.subscribe((change) => {
      if (change === 'VALID') {
        this.valid.emit(true);
      } else {
        this.valid.emit(false);
      }
    });
  }
  //    ng-model-options="{debounce: 300}"
}
