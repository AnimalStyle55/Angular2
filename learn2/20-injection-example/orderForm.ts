import {Component, Input} from '@angular/core';

import {ShippingMethods} from './shippingMethods';

@Component({
  selector: 'order-header',
  template: `
  <div class="card">
    <div class="card-content">
      <div class="card-title">{{customer}}</div>
      <select>
        <option *ngFor="let method of shippingOptions"
                value="{{method.time}}">{{method.option}}</option>
      </select>
  </div>
  `,
  providers: [ShippingMethods]
})
export class OrderHeader {
  @Input('customerName')
  customer: string;
  shippingOptions: any[];

  constructor(shipMethods: ShippingMethods) {
    this.shippingOptions = shipMethods.getData();
  }
}

// ---------- Another component in the same file, this is OK ----------

@Component({
  selector: 'order-items',
  template: `
  <div class="card">
    <div class="card-content">
      <div class="card-title">
        Order Items
      </div>
      <ul class="collection">
        <li class="collection-item" *ngFor="let item of items">{{item.quantity}}:
        {{item.description}}</li>
      </ul>
    </div>
  </div>
  `
})
export class OrderItems {
  @Input('items')
  items: {}[];
}
