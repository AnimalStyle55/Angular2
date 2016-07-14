import {Reducer, Action} from "@ngrx/store";

export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";
export const RESET = "RESET";

export interface AppState {
  counter: number;
}

export const counter: Reducer<number> = (value: number = 0, action: Action) => {

  switch (action.type) {
    case INCREMENT:
      return value + 1;

    case DECREMENT:
      return value - 1;

    case RESET:
      return 0;
    default:
      return value;
  }
};
