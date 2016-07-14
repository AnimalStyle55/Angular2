import {Injectable} from '@angular/core';

/* 
  It is generally not advised to bind directly to values in a service.
  It breaks the pattern of data flow of binding down and emitting events up.
  We will talk about better ways to do this in later steps.
*/

@Injectable()
export class SharedData {
  userInput = '';
}
