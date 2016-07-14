import {Component} from '@angular/core';

import {OrderList} from './orderList';
import {OrderDetails} from './orderDetails';
import {IOrder, fakeApiOrderData} from './apiTypes';

@Component({
  selector: 'my-app',
  templateUrl: 'app.html',
  directives: [OrderList, OrderDetails]
})
export class AppComponent {
  appOrders: IOrder[];
  order: IOrder;

  constructor() {
    this.appOrders = fakeApiOrderData;
  }

  choose(i: number) {
    this.order = this.appOrders[i];
  }
}
