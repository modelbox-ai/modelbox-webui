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
        OverlayContainerModule
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
        subscriber.next(project);
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
        subscriber.next(project);
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
    let basicService = TestBed.inject(BasicServiceService);
    // localStorage.setItem("project", JSON.stringify(project));
    spyOn(basicService, 'queryRootPath');
    let e = { value: 1 }
    app.handleProjectDropDown(e);
    expect(basicService.queryRootPath).toHaveBeenCalled();

  });

});