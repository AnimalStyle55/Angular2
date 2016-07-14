import {Component} from '@angular/core';

import {Blink} from './blink';
import {Bounce} from './bounce';
import {Drag} from './drag';

@Component({
  selector: 'my-app',
  templateUrl: 'app.html',
  directives: [Blink, Bounce, Drag]
})
export class AppComponent {

}
