import {Directive, OnInit, OnDestroy, Input} from '@angular/core';

@Directive({
  selector: '[blink]',
  host: {
    '[style.visibility]': "on ? 'visible' : 'hidden'"
  }
})
export class Blink implements OnInit, OnDestroy {
  @Input() public speed: number = 500;

  private intervalId: number;
  private on = true;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.on = !this.on;
    }, this.speed);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}

// The above code shows the direct, browser-centric way to do this.
// There are other ways, such as Observable.interval(), which
// binds to the browser less tightly and is much more composable.
