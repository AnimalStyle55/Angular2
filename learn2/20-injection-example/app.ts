import {Component} from '@angular/core';

import {OrderList} from './orderList';
import {OrderDetails} from './orderDetails';
import {OrderService} from './orderService';
import {GreetingCalculator} from './greetingCalculator';

@Component({
  selector: 'my-app',
  templateUrl: 'app.html',
  directives: [OrderList, OrderDetails],
  // viewProviders: [OrderService]
  // viewProviders: [GreetingCalculator]
})
export class AppComponent {
  appOrders: any;
  order: any;
  greeting: string;

  constructor(private ds: OrderService, gc: GreetingCalculator) {
    console.log('ds:', ds);
    // ds.flag = true;
    this.appOrders = ds.getData();
    this.greeting = gc.greeting();
  }

  setAppOrder(order: any) {
    this.order = order;
  }

  // constructor(ds: SimpleOrderService) {
  //   console.log('ds:', ds);
  //   this.appOrders = ds.getData();
  //   ds.clearData();
  // }
}
