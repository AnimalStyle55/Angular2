import {Component, Input, ViewEncapsulation} from "@angular/core";

import {IItem} from './apiTypes';

@Component({
  selector: 'order-header',
  template: `
  <div class="card">
    <div class="card-content">
      <div class="card-title">{{customer}}</div>
    </div>
  </div>
  `,
  styles: ['.card { background-color: #A8A4FF }']   // purple
  // styleUrls: ["my.css"]   // Relative to web root, not relative to this file
  // encapsulation: ViewEncapsulation.None     // Uncomment me, see what happens.
  // encapsulation: ViewEncapsulation.Native
})
export class OrderHeader {
  @Input('customerName') customer: string;
}

@Component({
  selector: 'order-items',
  template: `
  <div class="card">
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
  @Input('items') items: IItem[];
}
