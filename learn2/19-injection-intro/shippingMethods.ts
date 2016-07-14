import {Injectable} from '@angular/core';

@Injectable()
export class ShippingMethods {
  data: any[];

  // Could use injection here, 'sm: OrderService'
  constructor() {
    this.data = [
      {
        'option': 'ground',
        'time': '3-5 Weeks'
      }, {
        'option': 'air',
        'time': '2-4 Days'

      }, {
        'option': 'drone',
        'time': '1-2 hours'
      }
    ];
  }
  getData() {
    return this.data;
  }
}
