import {Component, Input, Output, EventEmitter} from '@angular/core';

import {IOrder} from './apiTypes';

@Component ({
  selector: 'order-list',
  templateUrl: 'orderList.html'
})
export class OrderList {
  @Input() orders: IOrder[];
  @Output() selectOrder = new EventEmitter<IOrder>();

  onSelect(order: IOrder) {
    this.selectOrder.next(order);
  }
}
