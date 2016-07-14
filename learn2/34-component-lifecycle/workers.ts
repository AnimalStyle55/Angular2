import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class Workers {
  constructor(private http: Http) { }

  workerList() {
    const delayUntil: Date = new Date(Date.now() + 2000);
    return this.http.get('../demo-data/workers.json')
      .map((res: Response) => res.json())
      .delay(delayUntil);
  }
}
