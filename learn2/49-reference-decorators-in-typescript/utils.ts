import {sprayPaint} from "./exampleDecorator";

@sprayPaint
export class Helper {
  helpMe(): number {
    return 42;
  }
}
