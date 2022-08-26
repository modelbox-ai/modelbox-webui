import { Component, Input } from '@angular/core';

@Component({
  selector: 'd-modal-guide-main',
  templateUrl: './modal-guide-main.component.html',
  styleUrls: ['./modal-guide-main.component.less'],
})
export class ModalGuideMainComponent {
  @Input() data: any;
  @Input() handler: Function;

  ngOnInit(){
  }

  close($event) {
    this.handler($event);
  }
}
