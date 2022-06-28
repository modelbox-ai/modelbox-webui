import { DataServiceService } from "./data-service.service";
import { DomSanitizer } from '@angular/platform-browser';
import { BasicServiceService } from '@shared/services/basic-service.service';
import { ToastService } from 'ng-devui/toast';
import { I18nService } from '@core/i18n.service';
import { test_transformed_data, test_flowunits_data } from "./test-flowunit-data";

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

  it('transformFlowunit', () => {
    service.flowunits = test_flowunits_data;
    let res = test_transformed_data;
    expect(service.transformFlowunit()).toEqual(res);
  });

});