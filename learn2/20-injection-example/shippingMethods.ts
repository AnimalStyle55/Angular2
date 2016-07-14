import {Injectable} from '@angular/core';

import {OrderService} from './orderService';

@Injectable()
export class ShippingMethods {
  data: any[];

  // What if I wanted to use injection here?
  constructor(sm: OrderService) {
    this.data = [
      {
        'option': 'ground',
        'time': '3-5 Weeks',
      }, {
        'option': 'air',
        'time': '2-4 Days',

      }, {
        'option': 'drone',
        'time': '1-2 hours'
      }
    ]
  }
  getData() {
    return this.data;
  }
}
