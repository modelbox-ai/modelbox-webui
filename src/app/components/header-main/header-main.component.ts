import { Component, OnInit } from '@angular/core';
import { I18nService } from '@core/i18n.service';
import { Router } from '@angular/router';
declare const require: any;

@Component({
  selector: 'app-header-main',
  templateUrl: './header-main.component.html',
  styleUrls: ['./header-main.component.less']
})
export class HeaderMainComponent implements OnInit {
  consoleName: string = this.i18n.getById('consoleName');
  helpSvg = require("../../../assets/help.svg");
  apiSvg = require("../../../assets/api.svg");
  logoSvg = require("../../../assets/model-arts-logo.svg");
  helpText: string = this.i18n.getById('common.help');
  activeFirstPage = true;
  activeExDisplay = false;
  activeEditor = false;
  activeTaskLists = false;
  
  constructor(private i18n: I18nService, private router: Router) { }
  ngOnInit(): void { }

  click(tab: string): void {
    if (tab === 'editor') {
      this.activeFirstPage = false
      this.activeExDisplay = false;
      this.activeEditor = true;
      this.activeTaskLists = false;
      this.goMain();
    } else if (tab === 'example') {
      this.activeFirstPage = false
      this.activeExDisplay = true;
      this.activeEditor = false;
      this.activeTaskLists = false;
      this.goExample();
    } else if (tab === 'task') {
      this.activeFirstPage = false
      this.activeExDisplay = false;
      this.activeEditor = false;
      this.activeTaskLists = true;
      this.goTask();
    } else{
      this.activeFirstPage = true
      this.activeExDisplay = false;
      this.activeEditor = false;
      this.activeTaskLists = false;
      this.goFirst();
    }
  }

  goMain(): void {
    this.router.navigateByUrl("main");
  }

  goFirst(): void {
    this.router.navigateByUrl("");
  }

  goTask():void {
    //
  }

  goExample(): void {
    this.router.navigateByUrl("solution");
  }

}
