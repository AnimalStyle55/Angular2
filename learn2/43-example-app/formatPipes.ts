import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'stringCentimetersToNumberFeet'
})
export class StringCentimetersToNumberFeetPipe implements PipeTransform {
  transform(input: any) {
    if (parseFloat(input)) {
      return parseFloat(input) / 32;
    } else {
      return input;
    }
  }
}

@Pipe({
  name: 'roundTo'
})
export class RoundToPipe implements PipeTransform {
  transform(input: any, roundTo: number){
    if (_.isNumber(input) && _.isNumber(roundTo)) {
      return Math.round(input * Math.pow(10, roundTo)) / Math.pow(10, roundTo);
    } else {
      return input;
    }
  }
}
