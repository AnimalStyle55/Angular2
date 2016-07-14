import {Component, Input, Output, EventEmitter} from "angular2/core";
import {bootstrap} from "angular2/platform/browser";
import {Store} from "@ngrx/store";
import {INCREMENT, DECREMENT, RESET} from "./counter";
import {Observable} from "rxjs/Observable";
import {provideStore} from "@ngrx/store";

import {CounterDisplay} from "./counter-display.ts";
import {counter, AppState} from "./counter";

@Component({
  selector: "my-app",
  template: `
    <counter-display [counter]="counter$ | async" (increment)="increment()" (decrement)="decrement()"></counter-display>
    `,
  directives: [CounterDisplay]
})
class MyApp {
  counter$: Observable<number>;

  constructor(public store: Store<AppState>) {
    this.counter$ = store.select(store => store.counter );
  }

  increment() {
    console.log("dispatch increment");
    this.store.dispatch({ type: INCREMENT });
  }

  decrement() {
    console.log("dispatch decrement");
    this.store.dispatch({ type: DECREMENT });
  }

  reset() {
    this.store.dispatch({ type: RESET });
  }
}

bootstrap(MyApp, [provideStore({ counter }, { counter: 0 })]);
