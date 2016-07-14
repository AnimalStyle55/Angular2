import {Component} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';

@Component({
  selector: 'my-app',
  templateUrl: './template.html'
})
class AppComponent {
  version: string;
  // Implicit public, equivalent to
  // public version: string;
  // (public is the default in TypeScript.)
  // Angular.io style guide recommends implicit public.
  person: string;
  stringWithHtml: string;
  personObject: any;
  private x: string = 'Only available inside';
  age: number;
  text: string = "TEST Input";
  color: string = "green";

  constructor() {
    this.version = 'Other';
    this.person = 'everyone';
    this.stringWithHtml = `
      <button onClick='console.log('hello from old-school HTML/JS');'>
        Press Me
      </button>
      <i>Hello from <b>HTML</b></i>
    `;
    this.personObject = { mother: 'Jane' };
    this.x = 'Hello World';

    this.age = 29;
  }

  calculate(): number {
    console.log('calculating');
    return 22 / 7;
  }
}


bootstrap(AppComponent);
