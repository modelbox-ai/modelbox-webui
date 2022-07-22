import { DataServiceService } from "./data-service.service";
import { BasicServiceService } from '@shared/services/basic-service.service';
import { ToastService } from 'ng-devui/toast';
import { I18nService } from '@core/i18n.service';
import { test_transformed_data, test_flowunits_data } from "./test-flowunit-data";

describe('DataService: titleCase', () => {
  let service: DataServiceService;
  let basicService: BasicServiceService;
  let toastService: ToastService;
  let i18n: I18nService;


  beforeEach(() => {
    service = new DataServiceService(basicService, toastService, i18n);
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

  it('pathValidate', () => {
    let path1 = '/';
    let path2 = '/asdf';
    let path3 = '/asdf/scd.csv';
    let path4 = '//asdf';
    let path5 = '/asd/ads/c.csv/';
    let path6 = 'asd/asfd/a';
    let path7 = "D:/test.xml";               // D:/test.xml
    let path8 = "D:\\folder\\test.xml";      // D:\folder\test.xml
    let path9 = "D:/folder/test.xml";        // D:/folder/test.xml
    let path10 = "D:\\folder/test.xml";       // D:\folder/test.xml
    let path11 = "D:\\test.xml";
    expect(service.pathValidate(path1)).toBeTrue();
    expect(service.pathValidate(path2)).toBeTrue();
    expect(service.pathValidate(path3)).toBeTrue();
    expect(service.pathValidate(path4)).toBeTrue();
    expect(service.pathValidate(path5)).toBeFalse();
    expect(service.pathValidate(path6)).toBeFalse();
    expect(service.pathValidate(path7)).toBeTrue();
    expect(service.pathValidate(path8)).toBeTrue();
    expect(service.pathValidate(path9)).toBeTrue();
    expect(service.pathValidate(path10)).toBeTrue();
    expect(service.pathValidate(path11)).toBeTrue();

  });

  it('loadProjectFlowunit', () => {
    //需要先创建项目
  });

});
