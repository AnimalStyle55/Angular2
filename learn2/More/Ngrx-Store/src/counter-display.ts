import {Component, Input, Output, EventEmitter} from "angular2/core";

@Component({
  selector: "counter-display",
  templateUrl: "./counter-display.html"
})
export class CounterDisplay {
  @Input()
  counter: number;
  @Output()
  increment = new EventEmitter<void>();
  @Output()
  decrement = new EventEmitter<void>();
};
