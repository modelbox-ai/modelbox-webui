import { DataServiceService } from "./data-service.service";
import { BasicServiceService } from '@shared/services/basic-service.service';
import { ToastService } from 'ng-devui/toast';
import { I18nService } from '@core/i18n.service';
import { test_transformed_data, test_flowunits_data } from "./test-flowunit-data";
import { flowInfo, graph_example, open_project } from "./mock-data";
import { Observable, of } from "rxjs";
import { fakeAsync, flush, TestBed } from "@angular/core/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { nodeShapeCategories } from "src/app/components/insert-panels/mock_data";

describe('DataService: titleCase', () => {
  let service: DataServiceService;
  let basicService: BasicServiceService;
  let toastService: ToastService;
  let i18n: I18nService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
      providers: [
        I18nService,
        DataServiceService,
        BasicServiceService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    })
    service = new DataServiceService(basicService, toastService, i18n);
    basicService = TestBed.inject(BasicServiceService);
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
    service.transformFlowunit();
    expect(service.transformedFlowunits).toEqual(res);
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

  it('loadProjectFlowunit', fakeAsync(() => {
    const httpSpy = TestBed.inject(HttpClient);
    spyOn(httpSpy, 'get').and.returnValue(of(open_project));
    service.setBasicService(basicService);
    service.loadProjectFlowunit("/root/pro1");
    flush();
    expect(service.flowunits).toBeTruthy();
  }));

  it('transformFlowunit', () => {
    expect(
      service.insertNodeType(graph_example).
        indexOf("node [shape=Mrecord]"))
      .toBeGreaterThan(-1);
  });

  it('getPortType', () => {
    expect(
      service.getPortType({
        inputports: [
          {
            "name": "in_image"
          }
        ]
      },
        "image_resiz:in_image"))
      .toEqual("input");
  });

  it('getLabel', () => {
    spyOn(service, 'getUnit').and.returnValue({
      "inputports": [
        {
          "name": "in_data"
        }
      ]
    });
    expect(
      service.getLabel("video_input", "cpu", "video_input")
    ).toBeTruthy();
  });

  it('loadFlowUnit', () => {

    service.setBasicService(basicService);
    spyOn(basicService, 'queryData').and.returnValue(new Observable(subscriber => {
      subscriber.next(flowInfo);
    }));
    expect(
      service.nodeShapeCategories
    ).toBeTruthy();
  });

  it('getUnit', () => {

    service.setBasicService(basicService);
    spyOn(basicService, 'queryData').and.returnValue(new Observable(subscriber => {
      subscriber.next(flowInfo);
    }));
    service.nodeShapeCategories = nodeShapeCategories;
    expect(
      service.getUnit("video_decoder", "cpu")
    ).toBeTruthy();
  });

});
