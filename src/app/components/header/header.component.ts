import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { I18nService } from '@core/i18n.service';
declare var require: any

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  consoleName: string = this.i18n.getById('consoleName');
  helpSvg = require("../../../assets/help.svg");
  apiSvg = require("../../../assets/api.svg");
  logoSvg = require("../../../assets/model-arts-logo.svg");
  helpText: string = this.i18n.getById('common.help');
  constructor(private i18n: I18nService) { }
  ngOnInit(): void { }
}
