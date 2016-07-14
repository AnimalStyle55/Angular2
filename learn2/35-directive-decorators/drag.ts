import {Directive} from '@angular/core';

@Directive({
  selector: '[makeDraggable]',
  host: {
    '[style.position]': "'relative'",
    '[style.border]': "'1px solid green'",
    '[style.padding]': "'3px'",
    '[style.backgroundColor]': "'#EEE'",
    '[style.cursor]': "'pointer'",
    '[style.left.px]': 'x',
    '[style.top.px]': 'y',
    '(mousedown)': 'mousedown($event)'
  }
})
export class Drag {
  public x = 0;
  public y = 0;

  private startX: number;
  private startY: number;
  private mm = this.mousemove.bind(this);
  private mu = this.mouseup.bind(this);

  mousedown(event: any) {
    event.preventDefault();
    this.startX = event.pageX - this.x;
    this.startY = event.pageY - this.y;
    // watch the whole window
    document.addEventListener('mousemove', this.mm);
    document.addEventListener('mouseup', this.mu);
  }

  mousemove(event: any) {
    this.x = event.pageX - this.startX;
    this.y = event.pageY - this.startY;
  }

  mouseup() {
    document.removeEventListener('mousemove', this.mm);
    document.removeEventListener('mouseup', this.mu);
  }
}
