import {Component} from '@angular/core';

// Available by default, don't need to be imported.
// import {Component, bootstrap, NgIf, NgFor, NgSwitch,
//   NgSwitchWhen, NgSwitchDefault} from '@angular/common';

const roomData = [
  { name: 'kitchen', contents: ['dishes', 'table', 'chairs']},
  { name: 'bedroom', contents: ['bed', 'lamp']}
];

@Component({
  selector: 'my-app',
  templateUrl: './template.html'
  // These are available by default, and don't need to be specified:
  // directives: [NgIf, NgFor, NgSwitch, NgSwitchWhen, NgSwitchDefault]
})
export class AppComponent {
  person: string = 'me';
  n: number = 0;
  todos: string[] = ['Eat Breakfast', 'Walk Dog', 'Breathe'];
  food: string = 'banana';
  rooms: any = roomData;

  increment(event: MouseEvent) {
    this.n++;
    this.todos.push(`Item ${this.n}`);
  }

  results() {
    if (this.n > 1 && this.n < 5) {
      return this.n;
    }
  }
}
