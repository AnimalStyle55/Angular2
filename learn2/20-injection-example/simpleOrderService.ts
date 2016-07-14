import orders from './rawOrders';

export class SimpleOrderService {
  private data: any;

  constructor() {
    this.data = orders;
    console.log('Instantiated');
  }

  getData() {
    return this.data;
  }

  clearData() {
    this.data = [];
  }
}
