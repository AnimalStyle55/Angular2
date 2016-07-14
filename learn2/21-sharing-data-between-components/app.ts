import {Component} from '@angular/core';

import {LayerOne} from './layer-one.component';

@Component({
  selector: 'my-app',
  templateUrl: 'app.html',
  directives: [LayerOne]
})
export class AppComponent { }
