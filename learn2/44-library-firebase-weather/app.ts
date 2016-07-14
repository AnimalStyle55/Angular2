// This is the main application file, it just composes things on the screen.

import {Component} from '@angular/core';

import "rxjs/Rx";

import {WeatherPanel} from './weatherPanel.ts';

var template = `
  <div class="container-fluid">
    <h1>Angular 2 / Firebase / Observable Weather App</h1>
    <p>The purpose of this application is to show how Angular 2 development
       can be very declarative, among other things.</p>
    <div class="row">
      <div *ngFor="let c of cities" class="col-md-4">

        <weather-panel [city]="c"></weather-panel>

      </div>
    </div>
  </div>
`;

@Component({
  selector: 'my-app',
  template: template,
  directives: [WeatherPanel]
})
export class AppComponent {
  cities: string[] = ['sanfrancisco', 'austin', 'boston']
}
