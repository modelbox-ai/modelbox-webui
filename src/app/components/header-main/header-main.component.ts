import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
  logoSvg = "../../../assets/model-arts-logo.svg";
  helpText: string = this.i18n.getById('common.help');
  @Input() active = "";

  @ViewChild('exampleDisplay') target;

  constructor(private i18n: I18nService, private router: Router) { }
  ngOnInit(): void { }

  click(tab: string): void {
    if (this.active === tab) {
      location.reload();
      return;
    }
    if (tab === 'main') {
      this.goMain();
    } else if (tab === 'solution') {
      this.goSolution();
    } else if (tab === 'management') {
      this.goManagement();
    } else {
      this.goFirst();
    }
  }

  goMain(): void {
    this.router.navigateByUrl("main");
  }

  goFirst(): void {
    this.router.navigateByUrl("");
  }

  goManagement(): void {
    this.router.navigateByUrl("management");
  }

  goSolution = () => {
    this.router.navigateByUrl("solution");
  }

}
