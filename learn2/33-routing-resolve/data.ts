import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Resolve} from '@angular/router';

import {ICompany} from './company';

@Injectable()
export class CompanyListRetriever implements Resolve<ICompany[]> {
  constructor(private http: Http) { }

  getCompanies() {
    return this.http.get('../demo-data/companies.json').map(r => r.json());
  }

  resolve() {
    return this.getCompanies();
  }
}
