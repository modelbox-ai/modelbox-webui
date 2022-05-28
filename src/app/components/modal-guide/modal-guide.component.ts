import { Component, Input } from '@angular/core';

@Component({
  selector: 'd-modal-guide',
  templateUrl: './modal-guide.component.html',
})
export class ModalGuideComponent {
  @Input() data: any;
  @Input() handler: Function;

  ngOnInit(){
  }

  close($event) {
    this.handler($event);
  }
}
