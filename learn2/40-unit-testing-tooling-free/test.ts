import {it, expect, describe, beforeEach} from "@angular/testing";

import {ContainsXPipe} from "./pipes";
import {GreetingCalculator} from "./greetingCalculator";
import {secondSuite} from "./test2";

// Simplest Test Case
it("true is true", function () { expect(true).toEqual(true); });

describe("the containsXPipe", () => {
  let pipe: ContainsXPipe;

  beforeEach(() => {
    pipe = new ContainsXPipe();
  });

  let sampleInput = ["abcde", "fghij"];

  it("correctly finds the appropriate subset for ['abcde'] with an input of 'abcde'", () => {
    expect(pipe.transform(sampleInput, "abcde")).toEqual(["abcde"]);
  });

  it("correctly returns empty array when appropriate", () => {
    expect(pipe.transform(sampleInput, "cb")).toEqual([]);
  });

  it("handles poor inputs gracefully", () => {
    expect(pipe.transform(sampleInput, undefined)).toEqual([]);
    expect(pipe.transform([], [])).toEqual([]);
    expect(pipe.transform("test", [])).toEqual("test");
    expect(pipe.transform("test", ["ABC"])).toEqual("test");
  });
});

describe("the greeting calculator", () => {
  let gc: GreetingCalculator;

  beforeEach(() => {
    gc = new GreetingCalculator();
  })

  it("should provide a greeting", () => {
    expect(gc.greeting()).toBe("Hello, World");
  })
});

secondSuite();
