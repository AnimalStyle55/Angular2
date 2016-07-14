import {Component} from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: 'template.html'
})
export class AppComponent {
  credentials: { login: string, password: string };

  constructor() {
    this.credentials = { login: '', password: '' };
  }

  // Event handler for form submit
  onLogin(): void {
    console.log('Form Submitted', this.credentials);
  }
}
