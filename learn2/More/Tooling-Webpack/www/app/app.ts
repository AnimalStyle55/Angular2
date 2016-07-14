import {Component} from '@angular/core';
import {bootstrapStatic} from '@angular/platform-browser';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';

import {Hello} from './hello';
import {ListComponent} from './list';

@Component({
  selector: 'my-app',
  template: require('./app.html'),
  directives: [Hello, ListComponent]
})
class AppComponent {

}

bootstrap(AppComponent,
  [HTTP_PROVIDERS]);
