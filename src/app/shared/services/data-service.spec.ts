import { DataServiceService } from "./data-service.service";
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import units from './units.json';
import { BasicServiceService } from '@shared/services/basic-service.service';
import { ToastService } from 'ng-devui/toast';
import { SolutionComponent } from 'src/app/components/solution/solution.component';
import { I18nService } from '@core/i18n.service';

describe('DataService: titleCase', () => {
  let service: DataServiceService;
  let sanitized: DomSanitizer;
  let basicService: BasicServiceService;
  let toastService: ToastService;
  let i18n: I18nService;


  beforeEach(() => {
    service = new DataServiceService(sanitized, basicService, toastService, i18n);
  });

  afterEach(() => {
    service = null;
  });

  it('title case function', () => {
    let testStr = 'hello world';
    let res = 'Hello world';
    expect(service.titleCase(testStr)).toEqual(res);
  });

  it('sleep function', () => {
    expect(service.sleep(50)).toBeTruthy();
  });

  it('getCurrentPage', () => {
    service.currentPage = "main";
    let res = "main";
    expect(service.getCurrentPage()).toEqual(res);
  });

});