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
  setAppOrder: Function;
  order: IOrder;

  constructor() {
    this.appOrders = fakeApiOrderData;
    this.setAppOrder = (order: IOrder) => {
      this.order = order;
    };
  }
}
