import {DatePipe} from '@angular/common';
import {Injectable} from '@angular/core';

@Injectable()
export class DateFormatter {
  x = 3;

  constructor (private date: DatePipe) {
  }
}
