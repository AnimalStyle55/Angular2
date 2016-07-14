import {Helper} from "./utils.js";

class Main {

  constructor() {
    this.h = new Helper();
  }

  run() {
    console.log(this.h.helpMe());

    const someString = `This is a
    multi line
    string`;


    if (true) {
       var isDone = false;
       let notAvailableOutside = true;
    }

    console.log(isDone);

  }
}

new Main().run();
