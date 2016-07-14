import {OnInit, Component} from '@angular/core';
import {Http} from '@angular/http';
import {FormGroup, FormBuilder, Validators, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {simpleAsyncValidator, westernZipValidatorFactory, slowAsyncValidator} from './asyncValidators';

@Component({
  selector: 'my-app',
  templateUrl: 'template.html',
  directives: REACTIVE_FORM_DIRECTIVES
})
export class AppComponent implements OnInit {
  inputFormGroup: FormGroup;

  constructor(private http: Http) { }

  ngOnInit() {
    this.inputFormGroup = new FormBuilder().group({
      input: ['', Validators.nullValidator, simpleAsyncValidator],
      zip: [
        '',
        Validators.compose([
          Validators.minLength(5),
          Validators.maxLength(5),
          Validators.required]),
        Validators.composeAsync([
          slowAsyncValidator,
          westernZipValidatorFactory(this.http)])
      ]
    });
  }

  logTheForm(): void {
    console.log('form: ', this.inputFormGroup);
  }
}
