import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';

import {Swapi} from '../swapi';
import {CharacterCard} from './characterCard';
import {Details} from './stats';
import {Stats, PointsManager} from './points';

let template = `
<div class="row">
  <div class="col-sm-6 col-md-push-2 col-md-4">
    <stats-form [stats]="userStats" (statChange)="updateStats()"></stats-form>
  </div>
  <div class="col-sm-6 col-md-push-2 col-md-4">
    <character-card [character]="characterDetails" [dex]="calcDex()" [str]="calcStr()"></character-card>
    <button (click)="storeCharacter()" class="btn btn-default" [disabled]="pointsUsed() > pointsLeft()">
      <a>Next</a>
    </button>
  </div>
</div>
`;
@Component({
  template,
  directives: [CharacterCard, Details, ROUTER_DIRECTIVES]
})
export class ConfigureScreen implements OnInit {
  characterDetails: any;
  userStats: Stats = new Stats('0', '0', 100);

  constructor( private activatedRoute: ActivatedRoute,
    private router: Router, private swapi: Swapi) {
  }

  ngOnInit() {
    this.activatedRoute.params
      .map(params => params['id'])
      .subscribe((id) => {
        this.swapi.getPerson(id).then(
          results => this.characterDetails = results
        );
    });
  }

  pointsUsed() {
    return PointsManager.pointsUsed(this.userStats);
  }
  pointsLeft() {
    return PointsManager.pointsLeft(this.userStats);
  }

  calcStr() {
    return this.characterDetails && this.characterDetails.baseStr + parseInt(this.userStats.additionalStrength, 10);
  };
  calcDex() {
    return this.characterDetails && this.characterDetails.baseDex + parseInt(this.userStats.additionalDexterity, 10);
  };
  storeCharacter() {
    this.characterDetails.userStats = this.userStats;
    localStorage.setItem('characterObject', JSON.stringify(this.characterDetails));
    console.log('navigating');
    this.router.navigate(['/summary']);
  }
}

