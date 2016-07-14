import {OnInit, Component} from '@angular/core';
import {FormGroup, FormBuilder, Validators, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: 'template.html',
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class AppComponent implements OnInit {
  loginFormGroup: FormGroup;

  ngOnInit() {
    this.loginFormGroup = new FormBuilder().group({
      login: ['', Validators.required],
      password: ['', Validators.compose(
          [Validators.minLength(3), Validators.required])],
      optional: ['default value']
    });
  }

  onLogin(): void {
    console.log('Form Submitted', this.loginFormGroup.value);
  }

  logTheForm(): void {
    console.log('form: ', this.loginFormGroup);
  }
}
