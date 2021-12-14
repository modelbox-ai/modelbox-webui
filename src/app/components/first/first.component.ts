import { Component, OnInit } from '@angular/core';
import { I18nService } from '@core/i18n.service';
import { HeaderMainComponent } from '../header-main/header-main.component';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.less']
})
export class FirstComponent implements OnInit {

  constructor(private i18n: I18nService) { }

  ngOnInit(): void {
  }

}
