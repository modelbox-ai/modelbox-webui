import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { I18nService } from "@core/i18n.service";
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DataServiceService } from "@shared/services/data-service.service";
import { OverlayContainerModule, OverlayContainerRef } from "ng-devui/overlay-container";
import { InsertPanelsComponent } from "./insert-panels.component";
import { context_example, nodeShapeCategories } from "./mock_data";
import { BasicServiceService } from "@shared/services/basic-service.service";
import { Observable, of } from "rxjs";
import { flowInfo } from "@shared/services/mock-data";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}

describe("InsertPanelsComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InsertPanelsComponent
      ],
      imports: [
        HttpClientModule,
        TranslateModule.forChild({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
          }
        }),
        OverlayContainerModule
      ],
      providers: [
        I18nService,
        DataServiceService,
        OverlayContainerRef,
        TranslateService,
        TranslateStore,
        BasicServiceService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  });

  it('should create the InsertPanelsComponent', () => {
    const fixture = TestBed.createComponent(InsertPanelsComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('toggleTip & handleTipText', () => {
    const fixture = TestBed.createComponent(InsertPanelsComponent);
    const app = fixture.componentInstance;

    spyOn(app, "handleTipText");
    app.toggleTip({
      isOpen: function () { },
      close: function () { },
      open: function () { }
    }, context_example);
    expect(app.handleTipText).toHaveBeenCalled();

  });

  it('search Node: onSearch & searchGroupByNameOfCategories', () => {
    const fixture = TestBed.createComponent(InsertPanelsComponent);
    const app = fixture.componentInstance;
    app.nodeShapeCategories = nodeShapeCategories;
    spyOn(document, 'querySelectorAll');
    app.eles = [{ outerText: "http", setAttribute: function (a, b) { } }];
    app.onSearch("c");
    app.eles = [{ outerText: "http", setAttribute: function (a, b) { } }];
    app.onSearch("c");
    expect(document.querySelectorAll).toHaveBeenCalledWith('.search-detail')
  });

  it('loadFlowunit', () => {
    const fixture = TestBed.createComponent(InsertPanelsComponent);
    const app = fixture.componentInstance;
    let service = TestBed.inject(BasicServiceService);
    let spy: any;
    spy = spyOn(service, 'queryData').and.returnValue(new Observable());
    expect(app.loadFlowUnit(false, "/root/pro1/src/flowunit", "/root/pro1")).toBeFalsy();
    expect(service.queryData).toHaveBeenCalled();

  });

  it('loadFlowunit inside test', fakeAsync(() => {
    const fixture = TestBed.createComponent(InsertPanelsComponent);
    const app = fixture.componentInstance;
    const mockDataObj = flowInfo;
    const httpSpy = TestBed.inject(HttpClient)
    spyOn(httpSpy, 'put').and.returnValue(of(mockDataObj))

    app.loadFlowUnit(false, "/root/pro1/src/flowunit", "/root/pro1")
    flush(); // clear out any pending tasks in queue including observable magic
    
    expect(app.nodeShapeCategories).toBeTruthy();
  }));

});