import {Component} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';

import {Hello} from './hello';
import {ListComponent} from './list';

@Component({
  moduleId: __moduleName,
  selector: 'my-app',
  templateUrl: "app.html",
  directives: [Hello, ListComponent]
})
class AppComponent {

}

bootstrap(AppComponent,
  [HTTP_PROVIDERS]);
