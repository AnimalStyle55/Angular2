// This is TS/ES2015 module loading, not Angular DI
import orders from './rawOrders';

export class OrderService {
  private data: any[];
  public flag = false;

  // This constructor accepts a parameter for learning purposes,
  // to make it possible to demonstrate how to inject something
  // that has a non-default constructor.
  constructor(flag: boolean) {
    this.data = orders.slice(); // clone
    if (flag) {
      this.data[0].customer = 'TESTING 123';
      this.data[0].items = [];
      this.data[1].customer = 'TESTING 123';
      this.data[1].items = [];
    }
  }

  getData() {
    return this.data;
  }
}
