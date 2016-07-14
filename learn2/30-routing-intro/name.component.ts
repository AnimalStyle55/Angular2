import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  template: `
    <div class="card">
      <div class="card-content">
        <div class="card-title">Hello {{message}}</div>
        <p>This is a less simple example component.</p>
      </div>
    </div>
  `
})
export class NameComponent implements OnInit {
  private message: string;
  private sub: Subscription;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.message = params['who'];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
