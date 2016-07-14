import {Component, Input} from '@angular/core';

import {IItem} from './apiTypes';

@Component({
  selector: 'order-header',
  template: `
  <div class="card">
    <span class="component-marker">OrderHeader</span>
    <div class="card-content">
      <div class="card-title">{{customer}}</div>
    </div>
  </div>
  `
})
export class OrderHeader {
  @Input('customerName') customer: string;
}

@Component({
  selector: 'order-items',
  template: `
  <div class="card">
    <span class="component-marker">OrderItems</span>
    <div class="card-content">
      <div class="card-title">Order Items</div>
      <ul class="collection">
        <li class="collection-item" *ngFor="let item of items">{{item.quantity}}:
        {{item.description}}</li>
      </ul>
    </div>
  </div>
  `
})
export class OrderItems {
  @Input() items: IItem[];
}
