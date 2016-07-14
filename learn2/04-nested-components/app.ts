import {Component} from "@angular/core";
import {bootstrap} from "@angular/platform-browser-dynamic";

@Component({
    selector: "blue-card",
    template: `
    <div class="card blue">
      <h4>I am a blue card ({{x}})</h4>
    </div>
  `
})
class BlueCard {
    x = Math.random();
}

@Component({
    selector: 'green-card',
    template: `
    <div class="card green" style="padding: 10px">
      <h4>I am a green card</h4>
      <blue-card></blue-card>
      <div *ngIf="count > 0">
        <green-card [count]="count - 1"></green-card>
      </div>
    </div>
  `,
    directives: [BlueCard, GreenCard]
})
class GreenCard {
    count: number;
}

@Component({
    selector: 'my-app',
    template: `
    <h4>Example application showing component nesting</h4>
    <blue-card></blue-card>
    <green-card [count]="5"></green-card>
  `,
    directives: [BlueCard, GreenCard]
})
class AppComponent { }

bootstrap(AppComponent);

