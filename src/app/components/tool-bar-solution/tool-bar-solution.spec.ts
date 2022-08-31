import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed, tick } from "@angular/core/testing";
import { I18nService } from "@core/i18n.service";
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DataServiceService } from "@shared/services/data-service.service";
import { DialogService } from "ng-devui/modal";
import { OverlayContainerModule, OverlayContainerRef } from "ng-devui/overlay-container";
import { ToolBarSolutionComponent } from "./tool-bar-solution.component";
import { solutionList, solutionListTarget } from "./mock-data";
import { BasicServiceService } from "@shared/services/basic-service.service";
import { Observable } from "rxjs";
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { solutions } from "../tool-bar/mock-data";
import { tasks } from "@shared/services/mock-data";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}

describe("ToolBarSolutionComponent", () => {
  let service: BasicServiceService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forChild({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
          }
        }),

        HttpClientModule,
        HttpClientTestingModule,
        OverlayContainerModule,
        BrowserAnimationsModule,
        NoopAnimationsModule
      ],
      declarations: [
        ToolBarSolutionComponent
      ],
      providers: [
        DialogService,
        I18nService,
        DataServiceService,
        OverlayContainerRef,
        TranslateService,
        TranslateStore,
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(BasicServiceService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should create the ToolBarSolutionComponent', () => {
    const fixture = TestBed.createComponent(ToolBarSolutionComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    expect(app.showLoading).toBeTrue();
    spyOn(app, "loadSolutionData");
    app.ngOnInit();
    expect(app.loadSolutionData).toHaveBeenCalled();
  });

  it('loadSolutionData', () => {
    const fixture = TestBed.createComponent(ToolBarSolutionComponent);
    const app = fixture.componentInstance;
    let response = solutionList;
    service.querySolutionList().subscribe(data => {
      let solution = data.demo_list;
      app.solutionList = [];
      solution.forEach((item) => {
        let obj = { demo: '', desc: '', graphfile: '', name: '' };
        obj.demo = item.demo;
        obj.desc = item.desc;
        obj.graphfile = item.graphfile;
        obj.name = item.name;
        app.solutionList.push(obj);
      });
      expect(app.solutionList).toEqual(solutionListTarget);
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      "/editor/demo"
    );
    // Assert that the request is a GET.
    expect(req.request.method).toEqual("GET");
    // Respond with this data when called
    req.flush(response);

  });

  it('register handler', () => {
    const fixture = TestBed.createComponent(ToolBarSolutionComponent);
    const app = fixture.componentInstance;
    let e = "test";

    app.onUndoButtonClick = function (e) { };
    spyOn(app, "onUndoButtonClick");
    app.handleUndoButtonClick(e);
    expect(app.onUndoButtonClick).toHaveBeenCalled();

    app.onRedoButtonClick = function (e) { };
    spyOn(app, "onRedoButtonClick");
    app.handleRedoButtonClick(e);
    expect(app.onRedoButtonClick).toHaveBeenCalled();

    app.onZoomInButtonClick = function (e) { };
    spyOn(app, "onZoomInButtonClick");
    app.handleZoomInButtonClick(e);
    expect(app.onZoomInButtonClick).toHaveBeenCalled();

    app.onZoomOutButtonClick = function (e) { };
    spyOn(app, "onZoomOutButtonClick");
    app.handleZoomOutButtonClick(e);
    expect(app.onZoomOutButtonClick).toHaveBeenCalled();

    app.onZoomFitButtonClick = function (e) { };
    spyOn(app, "onZoomFitButtonClick");
    app.handleZoomFitButtonClick(e);
    expect(app.onZoomFitButtonClick).toHaveBeenCalled();

    app.onZoomResetButtonClick = function (e) { };
    spyOn(app, "onZoomResetButtonClick");
    app.handleZoomResetButtonClick(e);
    expect(app.onZoomResetButtonClick).toHaveBeenCalled();

    app.onNewButtonClick = function (e) { };
    spyOn(app, "onNewButtonClick");
    app.handleNewButtonClick(e);
    expect(app.onNewButtonClick).toHaveBeenCalled();

    app.onSwitchDirectionButtonClick = function (e) { };
    spyOn(app, "onSwitchDirectionButtonClick");
    app.handleSwitchDirectionButtonClick(e);
    expect(app.onSwitchDirectionButtonClick).toHaveBeenCalled();

    app.onRunButtonClick = function (e) { };
    spyOn(app, "onRunButtonClick");
    app.handleRunButtonClick(e);
    expect(app.onRunButtonClick).toHaveBeenCalled();

    app.onStopButtonClick = function (e) { };
    spyOn(app, "onStopButtonClick");
    app.handleStopButtonClick(e);
    expect(app.onStopButtonClick).toHaveBeenCalled();

    app.onRestartButtonClick = function (e) { };
    spyOn(app, "onRestartButtonClick");
    app.handleRestartButtonClick(e);
    expect(app.onRestartButtonClick).toHaveBeenCalled();

    app.onOpenTutorial = function (e) { };
    spyOn(app, "onOpenTutorial");
    app.openTutorial(e);
    expect(app.onOpenTutorial).toHaveBeenCalled();
  });

  it('onClickCard', () => {
    const fixture = TestBed.createComponent(ToolBarSolutionComponent);
    const app = fixture.componentInstance;
    let e = {
      demo: "car_detection",
      desc: "car detection for video streams",
      graphfile: "car_detection.toml",
      name: "car_detection.toml"
    }
    app.selectDemoDialog = {
      modalInstance: {
        hide: function () { },
        zIndex: 1
      }
    }

    spyOn(service, "querySolution").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(solutions);
      }));

    spyOn(service, "getTaskLists").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(tasks);
      }));

    app.onClickCard(e);
    expect(app.statusGraph).toBeTruthy();
  });

  it('showSelectDemoDialog', () => {
    const fixture = TestBed.createComponent(ToolBarSolutionComponent);
    const app = fixture.componentInstance;
    const debug = fixture.debugElement.componentInstance.selectDemo;
    let res = app.showSelectDemoDialog(debug);
    expect(res).toBeTruthy();
    let modals = document.querySelectorAll("d-modal");
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });
  });

});
