import {Directive, OnInit, OnDestroy, Input} from '@angular/core';

@Directive({
  selector: '[bounce]',
  host: {
    '[style.transform]': "'rotate(' + rotation() + 'deg)'"
  }
})
export class Bounce implements OnInit, OnDestroy {
  @Input() public speed: number = 25;

  private intervalId: number;
  private n = 0;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.n = this.n + 0.1;
    }, this.speed);
  }

  rotation(): number {
    return Math.sin(this.n) * 5;
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}

// As with Blink, this could be done at a greater abstraction
// from the browser interval settings.
