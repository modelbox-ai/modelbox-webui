import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-save-as',
  templateUrl: './modal-save-as.component.html',
  styleUrls: ['./modal-save-as.component.less']
})
export class ModalSaveAsComponent {
  data: { graphName: string }
  graphName: string
  constructor() { }
  ngOnInit(): void {
    this.graphName = this.data.graphName
  }
  onInputChange() {
    this.data.graphName = this.graphName
  }
}
