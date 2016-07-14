import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';

import {Hello} from './hello';
import {ListComponent} from './list';

const template =`
<h1>Angular 2 App in TypeScript with JSPM and SystemJS</h1>
<hello></hello>
<list-of-stuff></list-of-stuff>
`;

@Component({
  selector: 'my-app',
  template,
  directives: [Hello, ListComponent]
})
class AppComponent {

}

bootstrap(AppComponent,
  [HTTP_PROVIDERS]);
