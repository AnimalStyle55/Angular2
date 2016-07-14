import {Component} from "@angular/core";
import {bootstrap} from "@angular/platform-browser-dynamic";

@Component({
  selector: "my-app",
  templateUrl: "template.html"
})
class AppComponent {
  person: string = "me";
  userInput: string = "";
  n: number = 0;

  increment() {
    this.n ++;
  }
  typed(x: KeyboardEvent) {
    // Wire this up in class.
    console.log("value", x);
    // x.stopPropagation();
  }
}

bootstrap(AppComponent);
