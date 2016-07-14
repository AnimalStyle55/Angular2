import {DatePipe} from '@angular/common';
import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
  injectAsync
} from '@angular/testing';

import {OrderService} from './orderService';
import {DateFormatter} from './dateFormatter';
export let secondSuite = () => {
  describe('OrderService', () => {

    beforeEachProviders(() => [{ provide: OrderService, useFactory: () => new OrderService(false) },
      DateFormatter,
      DatePipe
    ]);

    it('should fetch our data', inject([OrderService], (orderService: OrderService) => {
      expect(orderService.getData().length).toBe(2);
    }));

    it('should fetch our data', inject([DateFormatter], (dateFormatService: DateFormatter) => {
      expect(dateFormatService.x).toBe(3);
    }));
  });
};
