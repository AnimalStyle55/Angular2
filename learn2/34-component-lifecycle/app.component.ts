import {Component} from '@angular/core';

import {WorkerCmp} from './worker.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  directives: [WorkerCmp]
})
export class AppComponent {
}
