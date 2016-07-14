import {Component} from '@angular/core';
import { FormGroup, FormControl, REACTIVE_FORM_DIRECTIVES, FormBuilder } from '@angular/forms';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/Rx';

interface Item {
  url?: string;
  title?: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './template.html',
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class AppComponent {
  searchForm: FormGroup;
  results: Observable<Item[]>;

  constructor(private http: Http) {
    this.searchForm = new FormBuilder().group({'searchControl': ['']});

    this.results = this.searchForm.controls['searchControl'].valueChanges
      .do(x => console.log('change', x))
      .debounceTime(500)
      .do(x => console.log('after debounce', x))
      .switchMap((val: string) => this.searchRedditPics(val));
  }

  // The code below is in a component for easy demonstration;
  // in a real application, it belongs in another class.

  searchRedditPics(search: string): Observable<Item[]> {
    let baseUrl = 'https://www.reddit.com/r/aww/search.json?restrict_sr=on&q=';
    return this.http.get(baseUrl + search)
      .map((res: any) => res.json())
      .map(this.translateRedditResults);
  }

  translateRedditResults(items: any) {
    // This function is doesn't know anything about HTML or Observable; it just
    // manages the messy shape of this API's data return layout.

    const x = items.data.children;
    return x.map((item: any): Item => {
      if (item && item.data && item.data.thumbnail) {
        let thumb = item.data.thumbnail;
        if (thumb.startsWith('http')) {
          return { url: thumb };
        }
      }
      return { title: item.data.title };
    });
  }
}
