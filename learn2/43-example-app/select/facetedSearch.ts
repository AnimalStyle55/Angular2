import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'facet-button',
  template: `
          <button class="pref-button" (click)="clicked()"
                 [class.selected]="field == value">{{label}}</button>`
})
class FacetButton {
  @Input()
  field: any;
  @Output()
  fieldChange: EventEmitter<any> = new EventEmitter();
  @Output()
  change: EventEmitter<any> = new EventEmitter();
  @Input()
  value: string;
  @Input()
  label: string;

  clicked() {
    this.fieldChange.next(this.value);
    this.change.next({});
  }
}

let template = `
<div class="row">
  <div class="col-md-4">
    <label>Sex:<br>
      <facet-button [(field)]="searchFields.gender" value="m" label="Male" (change)="change()"></facet-button>
      <facet-button [(field)]="searchFields.gender" value="f" label="Female" (change)="change()"></facet-button>
      <facet-button [(field)]="searchFields.gender" value="n" label="Other" (change)="change()"></facet-button>
      <facet-button [(field)]="searchFields.gender" value="" label="All" (change)="change()"></facet-button>
    </label>
  </div>
  <div class="col-md-3">
    <label>Race:<br>
      <facet-button [(field)]="searchFields.race" value="human" label="Human" (change)="change()"></facet-button>
      <facet-button [(field)]="searchFields.race" value="droid" label="Droid" (change)="change()"></facet-button>
      <facet-button [(field)]="searchFields.race" value="" label="All" (change)="change()"></facet-button>
    </label>
  </div>
  <div class="col-md-5">
    <label>Stat Preference:<br>
      <facet-button [(field)]="searchFields.statPref" value="str" label="Strength" (change)="change()"></facet-button>
      <facet-button [(field)]="searchFields.statPref" value="dex" label="Dexterity" (change)="change()"></facet-button>
      <facet-button [(field)]="searchFields.statPref" value="" label="None" (change)="change()"></facet-button>
    </label>
  </div>
</div>
`;

@Component({
  selector: 'faceted-search',
  template,
  directives: [FacetButton]
})
export class FacetedSearch {
  @Input()
  searchFields: any;
  @Output()
  changed: EventEmitter<any> = new EventEmitter();

  change() {
    this.changed.next(this.searchFields);
  }
}
