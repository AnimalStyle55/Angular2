import {Component, Input,
  OnInit, OnChanges, SimpleChange, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';


import {Workers} from './workers';

@Component({
  selector: 'worker-cmp',
  templateUrl: './worker.component.html',
  viewProviders: [Workers]
})
export class WorkerCmp implements OnInit, OnChanges, OnDestroy {
  @Input() public label: string;
  @Input() public label2: string;

  workerList: {}[];
  intervalVal = 0;

  private secondListSubscription: Subscription;
  private intervalHandle: number;

  constructor(workers: Workers) {
    console.log('constructor');

    this.secondListSubscription = workers.workerList().subscribe((data: {}[]) => {
      this.workerList = data;
    });

    this.intervalHandle = setInterval(() => {
      this.intervalVal += 1;
      console.log('intervalVal:', this.intervalVal);
    }, 1000);
  }

  ngOnInit() {
    console.log('ngOnInit');
    if (!this.workerList) {
      this.workerList = [];
    }
  }

  ngOnChanges(change: { [key: string]: SimpleChange }) {
    console.log('A change has occurred', change);
    if (change['label']) {
      console.log(change['label'].currentValue);
    }
  }

  ngOnDestroy() {
    console.log('onDestroy called, cleaning up');
    this.secondListSubscription.unsubscribe();
    clearInterval(this.intervalHandle);
  }
}

