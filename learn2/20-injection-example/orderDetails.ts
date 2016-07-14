import {Component, Input} from '@angular/core';

import {OrderHeader, OrderItems} from './orderForm';

@Component({
  selector: 'order-details',
  templateUrl: 'orderDetails.html',
  directives: [OrderHeader, OrderItems]
})
export class OrderDetails {
  @Input('selectedOrderDetails') selectedOrderDetails: any;
}
