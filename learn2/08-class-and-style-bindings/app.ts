import {Component} from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './template.html',
  styleUrls: ['./component.css']
})
export class AppComponent {
  person: string = 'me';
  n: number = 1;

  increment(event: MouseEvent) {
    this.n++;
  }

  classFor(x: number) {
    if (x > 7) {
      return 'extra-class';
    }
  }
}
