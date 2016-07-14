import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'checkmark'
})
export class CheckmarkPipe implements PipeTransform {
  transform(input: boolean) {
    const checkMark = '\u2713';
    const xMark = '\u2718';
    return input ? checkMark : xMark;
  }
}

@Pipe({
  name: 'toCaps'
})
export class ToCapsPipe implements PipeTransform {
  transform(input: string) {
    if (input && input.toUpperCase) {
      return input.toUpperCase();
    }
    return input;
  }
}

@Pipe({
  name: 'containsX'
})
export class ContainsXPipe implements PipeTransform {
  transform(input: string[], needle: string) {
    if (input && input.filter) {
      // Look, an arrow function:
      return input.filter(v => v.indexOf(needle) > -1);
      // return input.filter(function (v) {
      //   return v.indexOf(needle) > -1;
      // });
    }
    return input;
  }
}

@Pipe({
  name: 'fieldRange'
})
export class FieldRangePipe implements PipeTransform {
  transform(input: { [name: string]: any }[], fieldName: string,
    lower: string, upper: string) {
    // Why {[name: string]: any}[] because the consumer of this pipe
    // could send us any kind of object.
    if (input && input.filter) {
      return input.filter(v => (v[fieldName] >= lower && v[fieldName] <= upper));
    }
    return input;
  }
}
