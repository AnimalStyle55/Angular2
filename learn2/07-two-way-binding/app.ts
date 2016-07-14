import {Component} from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './template.html'
})
export class AppComponent {
  name: string = 'John';
  color: string = 'Red';

  showEvent(e: MouseEvent) {
    console.log(e);
  }
}
