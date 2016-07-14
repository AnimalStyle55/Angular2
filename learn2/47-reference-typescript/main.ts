import {Helper} from "./utils";

class Main {
  private h: Helper;

  constructor() {
    this.h = new Helper();
  }

  run() {
    console.log(this.h.helpMe());

    const someString = `This is a
    multi line
    string`;
    // console.log(someString.foo);
  }
}

new Main().run();
