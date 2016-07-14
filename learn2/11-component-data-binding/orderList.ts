import {Component, Input} from '@angular/core';

import {IOrder} from './apiTypes';

@Component ({
  selector: 'order-list',
  templateUrl: 'orderList.html'
})
export class OrderList {
  // defaults to property name = variable name.
  // can override, @Input('name')
  @Input() orders: IOrder[];
}
