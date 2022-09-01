import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-vscode',
  templateUrl: './modal-vscode.component.html',
  styleUrls: ['./modal-vscode.component.less']
})
export class ModalVscodeComponent implements OnInit {
  @Input() projectPath: "";
  parent: HTMLElement;
  @Input() data: any;

  constructor(private elr: ElementRef) {

  }

  ngOnInit() {
    this.parent = this.elr.nativeElement.parentElement;
  }

  close(event) {
    this.data.onClose(event);
  }

  download(event) {
    this.data.onDownload(event);
  }

}
