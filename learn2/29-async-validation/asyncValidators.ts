import {Http} from '@angular/http';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

interface IValidationResult {
  [key: string]: any;
}

export function simpleAsyncValidator(): Promise<IValidationResult> {
  return Promise.resolve({ simpleAsyncValidator: 'blew up' });
  // OK
  // return Promise.resolve(undefined);
};

export function slowAsyncValidator(): Promise<IValidationResult> {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), 1000);
  });
};

const url = 'https://api.zippopotam.us/us/';

export function westernZipValidatorFactory(http: Http) {
  return (control: FormControl): Promise<IValidationResult> => {
    return http.get(url + control.value)
      .map(r => r.json())
      .do(r => console.log(r))
      .map(data => data.places[0].longitude)
      .map(l => l < -90)
      .do(ok => ok ? console.log('It is west enough') : console.log('It is not west enough'))
      .map(ok => ok ? undefined : { westerliness: 'not enough' })
      .catch(e => {
        return Observable.of({ westerliness: 'Unable to verify' });
      })
      .toPromise();
  };
}
