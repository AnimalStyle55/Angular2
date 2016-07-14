import {Component} from "@angular/core";
import {bootstrap} from "@angular/platform-browser-dynamic";

@Component({
  selector: "my-app",
  templateUrl: "template.html",
})
class AppComponent {
  name: string = "John";
  color: string = "Red";

  showEvent(e: any) {
      console.log(e);
  }
}

bootstrap(AppComponent);
