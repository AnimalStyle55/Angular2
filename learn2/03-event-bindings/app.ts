import {Component} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';

@Component({
  selector: 'my-app',
  templateUrl: './template.html'
})
class AppComponent {
    n: number = 0;
    visible: boolean = true;

  increment() {
    this.n ++;
  }

  typed(x: KeyboardEvent) {
    console.log('value', x);
  }

  mouseOver(x: MouseEvent) {
      console.log(x.toString());
      this.visible = !this.visible;
      
  }
}

bootstrap(AppComponent);
