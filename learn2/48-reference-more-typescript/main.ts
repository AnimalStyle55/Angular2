import {Helper} from "./utils";

class Main {
  private h: Helper;

  constructor() {
    this.h = new Helper();

    let height: number = 6;
    let name: string = "bob";
    name = "smith";

    let list: number[] = [1, 2, 3];

    let list2: Array<number> = [1, 2, 3];

    let notSure: any = 4;
    notSure = "maybe a string instead";
    notSure = false; // okay, definitely a boolean
  }

  run() {
    console.log(this.h.helpMe());
  }

}

new Main().run();

class X<T> {
  constructor(private y: T) {}
  getT() {
    return this.y;
  }
}

let x = new X("three");

x.getT();

enum ColorOne { Red, Green, Blue };
let c: ColorOne = ColorOne.Green;

c = ColorOne.Blue;

enum ColorTwo { Red = 1, Green, Blue };
let c2: ColorTwo = ColorTwo.Green;

interface LabelledValue {
  label: string;
}

class LabelledThing implements LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);

interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: "white", area: 100 };
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({ color: "black" });

interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  if (result === -1) {
    return false;
  }
  else {
    return true;
  }
};

function foo (x: number) {
  if (x > 0) {
    return x;
  } else {
    return "Less than 0";
  }
}

interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date;
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) { }
}

class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");

class Animal {
  name: string;
  constructor(theName: string) { this.name = theName; }
  move(meters: number = 0) {
    console.log(this.name + " moved " + meters + "m.");
  }
}

class Snake extends Animal {
  constructor(name: string) { super(name); }
  move(meters = 5) {
    console.log("Slithering...");
    super.move(meters);
  }
}

class Horse extends Animal {
  constructor(name: string) { super(name); }
  move(meters = 45) {
    console.log("Galloping...");
    super.move(meters);
  }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
