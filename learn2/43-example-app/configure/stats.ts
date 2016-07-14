import {Component, Input} from '@angular/core';
import {Stats, PointsManager} from './points';

let template = `
<div class="panel panel-default">
  <div class="panel-heading">
    Configure
  </div>
  <div class="panel-body">
    <span [style.color]="pointsLeft() < 0 ? 'red' : 'black'">
      <div>
        Additional Strength: 0 <input type="range" min="0" max="20" style="width: 300px; display: inline-block" [(ngModel)]="stats.additionalStrength"> 20
      </div>
      <div>
        Additional Dexterity: 0 <input type="range" min="0" max="20" style="width: 300px; display: inline-block" [(ngModel)]="stats.additionalDexterity"> 20
      </div>

      <div [style.font-size.px]="pointsUsed()/20 + 14">
      Points Used: {{pointsUsed()}}
      </div>
      <div [style.font-size.px]="pointsLeft()-36">
        Points Left: {{pointsLeft()}}
      </div>
    </span>
  </div>
</div>
`;

@Component({
  selector: 'stats-form',
  template
})
export class Details {
  @Input()
  stats: Stats;
  pointsUsed() {
    return PointsManager.pointsUsed(this.stats);
  }
  pointsLeft() {
    return PointsManager.pointsLeft(this.stats);
  }
}

