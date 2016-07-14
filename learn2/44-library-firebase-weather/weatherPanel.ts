// Firebase Observable Demo App

import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from "rxjs/Subscription";

// This code uses our third-party Angular 2 / Firebase adapter:
// https://github.com/OasisDigital/angular2-firebase
// ... because it was written before the official library for that purpose.

import {observableFirebaseObject, observableFirebaseArray} from 'angular2-firebase';
import {SecondsToDatePipe} from './secondsToDatePipe.ts'

declare var Firebase: any;

let template = `
  <h3>Weather for {{city}}:</h3>
  <p>current temperature: {{ currently?.temperature }}</p>
  <p>current windSpeed: {{ currently?.windSpeed }}</p>

  <table class="table table-condensed">
    <tr>
      <th>Time</th>
      <th>Temp</th>
      <th>Precip</th>
    </tr>
    <tr *ngFor="let d of hourly$ | async">
      <td>{{ d.time | secondsToDate | date:'H:m:s' }}</td>
      <td>{{ d.temperature }}</td>
      <td>{{ d.precipIntensity }}</td>
    </tr>
  </table>
`;

@Component({
  selector: 'weather-panel',
  template,
  pipes: [SecondsToDatePipe]
})
export class WeatherPanel implements OnInit, OnDestroy {
  @Input() city: string;

  hourly$: Observable<any[]>;
  currently: any;

  private subscription: Subscription;

  ngOnInit() {
    //  This can't be called in the constructor because the properties
    // from the parent template are not yet populated.

    const weatherURL = "https://publicdata-weather.firebaseio.com/";
    let city = new Firebase(weatherURL).child(this.city);

    // More automatic way to move data to the template:
    this.hourly$ = observableFirebaseArray(
      city.child("hourly/data").limitToLast(10));

    // Less automatic way to move data to the templat:
    this.subscription = observableFirebaseObject(city.child("currently"))
      .subscribe(c => this.currently = c);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
