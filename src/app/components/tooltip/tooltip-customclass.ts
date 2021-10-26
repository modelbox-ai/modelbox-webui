import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ngbd-tooltip-customclass',
  templateUrl: './tooltip-customclass.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
  .my-custom-class .tooltip-inner {
    background-color: #252b3a;
    font-size: 75%;
    width: 400px;
    max-width: 400px;
  }
  `]
})
export class NgbdTooltipCustomclass {

  @Input() displayedData: any;
  @Input() tipData: any;

  ngOnInit() {
  }

  toggleTip(tooltip, context) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ context });
    }
  }
}
