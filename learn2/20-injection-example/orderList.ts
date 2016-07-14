import {Component, Input, Output, EventEmitter} from '@angular/core';

import {OrderService} from './orderService';

@Component ({
  selector: 'order-list',
  templateUrl: 'orderList.html',
  // providers: [{ provide: OrderService, useFactory: () => new OrderService(false) } ]
  // outputs: ['selectOrder']
})
export class OrderList {
  @Input('orders') orders: any;
  @Output('selectOrder') selectOrder = new EventEmitter();

  onSelect(order: any) {
    this.selectOrder.next(order);
  }

  constructor(ds: OrderService) {
    ds.flag = true;
    // console.log('Fetching data from child component:', ds.getData());
  }
}
