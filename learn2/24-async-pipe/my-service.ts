import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export interface IShip {
  name: string;
  filmName: string;
}

const sampleShipData: IShip[] = [
  { name: 'Titanic', filmName: 'Titanic' },
  { name: 'Orca', filmName: 'Jaws' },
  { name: 'Poseidon', filmName: 'Poseidon' }
];

@Injectable()
export class MyService {

  // The details of constructing the promise and observable are not important;
  // rather, the important thing here is that this data is only available
  // asynchronously from this example data service.

  loadShips1(): Observable<IShip[]> {
    return Observable.of(sampleShipData).delay(1000);
  }

  loadShips2(): Promise<IShip[]> {
    return new Promise(function (resolve, reject) {
      setTimeout(() => resolve(sampleShipData), 1000);
    });
  }
}

