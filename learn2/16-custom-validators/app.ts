import {OnInit, Component} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';

// In a future Angular 2 release, we expecte it o be easy to import the needed
// types from Angular itself instead of specifying them here.

interface IValidationResult {
  [key: string]: any;
}

function trivialValidator(control: FormControl): IValidationResult {
  if (control.value === '12345') {
    return undefined;
  } else {
    return {
      valid: false
    };
  }
};

function fiveValidator(control: FormControl): IValidationResult {
  if (control.value !== '5') {
    return {
      valid: false,
      reason: 'you didn't type 5'
    };
  }
}

function matchingFieldValidator(firstKey: string, secondKey: string, errorName: string) {
  return function (group: FormGroup): IValidationResult {
    let first = group.controls[firstKey];
    let second = group.controls[secondKey];
    if (first.value !== second.value) {
      return {
        [errorName]: true
      };
    }
  };
}

@Component({
  selector: 'my-app',
  templateUrl: 'template.html',
  directives: REACTIVE_FORM_DIRECTIVES
})
export class AppComponent implements OnInit {
  loginFormGroup: FormGroup;

  ngOnInit() {
    this.loginFormGroup = new FormBuilder().group(
      {
        login: ['user', Validators.required],
        password: ['defaultPass', Validators.compose([Validators.minLength(3), Validators.required])],
        enterFive: ['5', fiveValidator],
        confirmPassword: ['pass', Validators.minLength(3)]
      },
      {
        validator: matchingFieldValidator('password', 'confirmPassword', 'mismatched')
      });
  }

  onLogin(): void {
    console.log('Form Submitted', this.loginFormGroup.value);
  }

  logTheForm(): void {
    console.log('form: ', this.loginFormGroup);
  }
}
