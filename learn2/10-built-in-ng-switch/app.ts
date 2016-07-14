import {Component} from '@angular/core';

// Available by default, don't need to be imported.
// import {Component, bootstrap, NgIf, NgFor, NgSwitch,
//   NgSwitchWhen, NgSwitchDefault} from '@angular/angular2';

@Component({
  selector: 'my-app',
  templateUrl: './template.html'
  // These are available by default, and don't need to be specified:
  // directives: [NgIf, NgFor, NgSwitch, NgSwitchWhen, NgSwitchDefault]
})
export class AppComponent {
  n: number = 0;
  food: string = 'apple';

  increment(event: MouseEvent) {
    this.n++;
  }

  results() {
    if (this.n > 1 && this.n < 5) {
      return this.n;
    }
  }
}
