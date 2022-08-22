import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { I18nService } from "@core/i18n.service";
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { BasicServiceService } from "@shared/services/basic-service.service";
import { DataServiceService } from "@shared/services/data-service.service";
import { DialogService } from "ng-devui/modal";
import { OverlayContainerModule, OverlayContainerRef } from "ng-devui/overlay-container";
import { Observable } from "rxjs";
import { openProject, project, solutions } from "./mock-data";
import { ToolBarComponent } from "./tool-bar.component";
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}

describe("ToolBarComponent", () => {

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
        OverlayContainerModule,
        BrowserAnimationsModule,
        NoopAnimationsModule
      ],
      declarations: [
        ToolBarComponent
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
  });

  it('should create the ToolBarComponent', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('init ToolBarComponent', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    localStorage.clear();
    localStorage.setItem("project", JSON.stringify(project));
    app.ngOnInit();
  });

  it('ngOnChanges', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    app.ngOnChanges(null);
  });

  it('loadGraphData', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    localStorage.clear();
    localStorage.setItem("project", JSON.stringify(project));
    let basicService = TestBed.inject(BasicServiceService);
    app.loadGraphData();
    spyOn(basicService, "openProject").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(openProject);
        expect(app.graphList).toBeTruthy();
        expect(app.graphSelectTableDataForDisplay).toBeTruthy();
      }));
  });

  it('loadGraphData toolBat.init', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    localStorage.clear();
    localStorage.setItem("project", JSON.stringify(project));
    let basicService = TestBed.inject(BasicServiceService);
    app.loadGraphData("toolBar.Init");
    spyOn(basicService, "openProject").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(openProject);
        expect(app.graphList).toBeTruthy();
        expect(app.graphSelectTableDataForDisplay).toBeTruthy();
      }));
  });

  it('getGraphNameFromGraph', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app.getGraphNameFromGraph(solutions.graph.graphconf)).toEqual("hello_world_diagraph");
  });

  it('closeInput', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
  });

  it('handleProjectDropDown: \
        clearCache, \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    localStorage.setItem("project", JSON.stringify(project));
    spyOn(Storage.prototype, 'clear')
    let e = { value: 6 }
    app.handleProjectDropDown(e);
    expect(Storage.prototype.clear).toHaveBeenCalled();

  });

  it('handleProjectDropDown: \
        sycnGraph, \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    localStorage.setItem("project", JSON.stringify(project));
    let basicService = TestBed.inject(BasicServiceService);
    spyOn(basicService, "openProject").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(openProject);
      }));
    let e = { value: 7 }
    app.handleProjectDropDown(e);
    expect(app.formData).toBeTruthy();

  });

  it('handleProjectDropDown: \
    showCreateProjectDialog, \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app.createProjectTemplate).toBeTruthy();
    let e = { value: 1 }
    app.showCreateProjectDialog = function (e) { };
    app.handleProjectDropDown(e);
  });

  it('handleProjectDropDown: \
    showOpenProjectButtonDialog, \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app.openProjectTemplate).toBeTruthy();
    let e = { value: 2 }
    app.showOpenProjectButtonDialog = function (e) { };
    app.handleProjectDropDown(e);
  });

  it('handleProjectDropDown: \
    showGraphSelectDialog, \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app.graphSelectTemplate).toBeTruthy();
    let e = { value: 4 }
    app.showGraphSelectDialog = function (e) { };
    app.handleProjectDropDown(e);
  });

  it('handleProjectDropDown: \
    handleNewGraphClick, \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app.graphSelectTemplate).toBeTruthy();
    let e = { value: 3 }

    app.handleProjectDropDown(e);

    let modals = document.querySelectorAll("d-modal");
    expect(modals).toBeTruthy();
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });
  });

  it('handleProjectDropDown: \
    handleNewGraphClick - clickOnOk \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app.graphSelectTemplate).toBeTruthy();
    let res = app.handleNewGraphClick(null);
    app.onNewGraphClickOk(res);
    expect(app.formData.graphName).toBeFalsy();

  });

  it('handleProjectDropDown: \
  saveAllProject - have not created project \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    localStorage.clear();
    localStorage.setItem("project", JSON.stringify(project));
    let basicService = TestBed.inject(BasicServiceService);
    spyOn(basicService, "openProject").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(openProject);
      }));

    let e = { value: 5 }
    app.formDataCreateProject.name = "";

    spyOn(basicService, "saveAllProject");
    app.dotSrcWithoutLabel = "";
    app.handleProjectDropDown(e);
    expect(app.dotSrcWithoutLabel).toBeFalsy();

    let modals = document.querySelectorAll("d-modal");
    expect(modals).toBeTruthy();
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });
  });

  it('handleProjectDropDown: \
  saveAllProject\
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    spyOn(localStorage.__proto__, 'getItem').and.returnValue(JSON.stringify(project));
    let basicService = TestBed.inject(BasicServiceService);
    spyOn(basicService, "openProject").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(openProject);
      }));

    let e = { value: 5 }
    app.formDataCreateProject.name = "test";
    app.dotSrcWithoutLabel = "";
    spyOn(basicService, "saveAllProject").and.returnValue(
      new Observable(subscriber => {
        subscriber.next({ status: 201 });
      }));;
    app.handleProjectDropDown(e);
    expect(basicService.saveAllProject).toHaveBeenCalled();

    let modals = document.querySelectorAll("d-modal");
    expect(modals).toBeTruthy();
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });
  });

  it('handleFlowunitDropDown: \
  showCreateFlowunitDialog\
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app.createFlowunitTemplate).toBeTruthy();
    let e = { value: 1 }
    app.showCreateFlowunitDialog = function (e) { };
    app.handleFlowunitDropDown(e);
    
  });


});