import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SolutionComponent } from "./solution.component";
import { I18nService } from '@core/i18n.service';
import { DataServiceService } from "@shared/services/data-service.service";
import { OverlayContainerRef } from "ng-devui/overlay-container";
import { DocumentRef } from "ng-devui";
import { Observable } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { BasicServiceService } from "@shared/services/basic-service.service";
import { dotSrc } from "../text-editor/mock-data";
import { solutions } from "../tool-bar/mock-data";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}

describe("SolutionComponent", () => {
  let service: BasicServiceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SolutionComponent
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
      ],
      providers: [
        I18nService,
        DataServiceService,
        OverlayContainerRef,
        TranslateService,
        TranslateStore,
        DocumentRef
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
    service = TestBed.inject(BasicServiceService);
  });

  it('should create the SolutionComponent', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should init the SolutionComponent', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
    app.project = {
      name: "test",
      dotSrc: "dotSrcTest",
      flow: ["flowTest"],
      driver: ["cpu"],
      graph: {}
    }
    spyOn(app, "updateStatus");
    app.ngOnInit();
    expect(app.name).toEqual(app.project.name);
    expect(app.dotSrc).toEqual(app.project.dotSrc);
    expect(app.flow).toEqual(app.project.flow);
    expect(app.driver).toEqual(app.project.driver);
    expect(app.graph).toEqual(app.project.graph);
    expect(app.profile).toBeFalsy();
    expect(app.updateStatus).toHaveBeenCalled();
  });

  it('ngAfterViewInit', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
    app.project = {
      name: "test",
      dotSrc: "dotSrcTest",
      flow: ["flowTest"],
      driver: ["cpu"],
      graph: {}
    }
    spyOn(app, "updateStatus");
    app.ngAfterViewInit();
    expect(app.refresh_timer).toBeTruthy();

  });

  it('updateStatus', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
    app.project = {
      name: "hello_world_diagraph"
    }
    spyOn(service, "getTaskLists").and.returnValue(
      new Observable(subscriber => {
        subscriber.next({
          job_list: [
            {
              "job_error_msg": "error",
              "job_id": "hello_world_diagraph",
              "job_status": "RUNNING"
            }
          ]
        });
      }));
    expect(app.statusGraph).toEqual("stop");
    app.updateStatus();
    expect(app.statusGraph).toEqual("fault");

  });

  it('handleTextChange && createUntitledName', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;

    let text = dotSrc;
    let undoRedoState = {
      hasRedo: false,
      hasUndo: true
    }
    app.graph = solutions.graph;
    app.handleTextChange(text, undoRedoState);
    expect(app.name).toEqual("Untitled");
    expect(app.dotSrc).toEqual(text);
    expect(app.hasUndo).toBeTruthy();
    expect(app.hasRedo).toBeFalsy();
  });

  it('handleGraphInitialized && getSvgString', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
  });

  it('register handler', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
    let e = "test";

    app.registerUndo(function () { return "undo"; }, undefined);
    expect(app.handleUndoButtonClick).toBeTruthy();

    app.registerRedo(function () { return "redo"; }, undefined);
    expect(app.handleRedoButtonClick).toBeTruthy();

    app.registerSwitchDirectionButtonClick(function () { return "switchDirection"; }, undefined);
    expect(app.handleSwitchDirectionButtonClick).toBeTruthy();

    app.registerEditorResize(function () { return "editorResize"; }, undefined);
    expect(app.editorResize).toBeTruthy();

    app.registerUndoReset(function () { return "resetUndoStack"; }, undefined);
    expect(app.resetUndoStack).toBeTruthy();

    app.registerZoomInButtonClick(function () { return "handleZoomInButtonClick"; }, undefined);
    expect(app.handleZoomInButtonClick).toBeTruthy();

    app.registerZoomOutButtonClick(function () { return "handleZoomOutButtonClick"; }, undefined);
    expect(app.handleZoomOutButtonClick).toBeTruthy();

    app.registerZoomFitButtonClick(function () { return "handleZoomFitButtonClick"; }, undefined);
    expect(app.handleZoomFitButtonClick).toBeTruthy();

    app.registerZoomResetButtonClick(function () { return "handleZoomResetButtonClick"; }, undefined);
    expect(app.handleZoomResetButtonClick).toBeTruthy();

    app.registerNodeAttributeChange(function () { return "handleNodeAttributeChange"; }, undefined);
    expect(app.handleNodeAttributeChange).toBeTruthy();

    app.registerNodeShapeClick(function () { return "handleNodeShapeClick"; }, undefined);
    expect(app.handleNodeShapeClick).toBeTruthy();

  });

  it('handleGutterEnd && handleGutterStart', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
  });

  it('updateConfig', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;

    app.updateConfig("test");
    expect(app.currentComponent).toEqual("test");
  });

  it('handleGutterEnd && handleGutterStart', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
  });

  it('handleCurrentProjectChange', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
    app.handleCurrentProjectChange(solutions);
    expect(app.dotSrc).toBeTruthy();
    expect(app.driver).toBeTruthy();
    expect(app.flow).toBeTruthy();
    expect(app.graph).toBeTruthy();
    expect(app.profile).toBeFalsy();
  });

  it('renameGraphSrc && getGraphNameFromGraph', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
    app.dotSrc = dotSrc;
    app.renameGraphSrc("test");
    expect(app.dotSrc.indexOf("test")).toBeGreaterThan(-1);
    expect(app.getGraphNameFromGraph(app.dotSrc)).toEqual("test");

  });

  it('handleTutorials', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
    expect(app.handleTutorials()).toBeTruthy();
  });

  it('handleTextEditorFocus && setFocus \
    && handleTextEditorBlur && setFocusIfFocusIs', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
  });

  it('handleRunButtonClick && handlehandleStopButtonClick \
    && handleRestartButtonClick', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
  });

  it('handleGraphComponentSelect', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
  });

  it('createOptionFromProject', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
  });

});