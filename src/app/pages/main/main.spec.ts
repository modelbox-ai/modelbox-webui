import { TestBed } from "@angular/core/testing";
import { DialogService, ModalService } from "ng-devui/modal";
import { MainComponent } from "./main.component";
import { ToolBarComponent } from "src/app/components/tool-bar/tool-bar.component";
import { OverlayContainerModule } from 'ng-devui/overlay-container';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { I18nService } from '@core/i18n.service';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { DataServiceService } from '@shared/services/data-service.service';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OverlayContainerRef } from 'ng-devui/overlay-container';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { project } from "src/app/components/tool-bar/mock-data";
import { BasicServiceService } from "@shared/services/basic-service.service";
import { Observable } from "rxjs";
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { tasks } from "@shared/services/mock-data";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}

jasmine.getEnv().allowRespy(true);

describe("MainComponent", () => {

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
        MainComponent
      ],
      providers: [
        DialogService,
        I18nService,
        DataServiceService,
        OverlayContainerRef,
        TranslateService,
        TranslateStore,
        ModalService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  });


  it('should create the MainComponent', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const app = fixture.componentInstance;
    let basicService = TestBed.inject(BasicServiceService);
    expect(app).toBeTruthy();
  });

  it('constructMainComponent', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const app = fixture.componentInstance;
    let basicService = TestBed.inject(BasicServiceService);
    spyOn(localStorage.__proto__, 'getItem').and.returnValue(null);
    spyOn(app, "initCurrentProject");
    spyOn(basicService, "queryRootPath").and.returnValue(
      new Observable(subscriber => {
        subscriber.next({
          "home-dir": "/root",
          "user": "root"
        });
      }));
    app.constructMainComponent();
    expect(app.initCurrentProject).toHaveBeenCalled();
  });

  it('constructMainComponent with current project', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const app = fixture.componentInstance;
    let basicService = TestBed.inject(BasicServiceService);
    spyOn(localStorage.__proto__, 'getItem').and.returnValue(JSON.stringify(project));
    spyOn(app, "loadProjectFromJson");
    spyOn(basicService, "queryRootPath").and.returnValue(
      new Observable(subscriber => {
        subscriber.next({
          "home-dir": "/root",
          "user": "root"
        });
      }));
    app.constructMainComponent();
    expect(app.loadProjectFromJson).toHaveBeenCalled();
  });

  it('ngOnInit without storage', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const app = fixture.componentInstance;
    spyOn(localStorage.__proto__, 'getItem').and.returnValue(null);
    spyOn(sessionStorage.__proto__, 'getItem').and.returnValue(null);
    app.ngOnInit();
    expect(app.portAddress).toEqual("22");
    let modals = document.querySelectorAll("d-modal");
    expect(modals).toBeTruthy();
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });
  });

  it('ngOnInit with storage', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const app = fixture.componentInstance;
    spyOn(sessionStorage.__proto__, 'getItem').and.returnValue(1);
    spyOn(localStorage.__proto__, 'getItem').and.returnValue(JSON.stringify(project));
    let spy = spyOn(app, 'updataStatusGraph');
    app.ngOnInit();
    expect(app.portAddress).toEqual("22");
    expect(spy).toHaveBeenCalled();

    clearInterval(app.refresh_timer);
    app.refresh_timer = null;
  });

  it('ngAfterViewInit', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const app = fixture.componentInstance;
  });

  it('updataStatusGraph', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const app = fixture.componentInstance;

    let basicService = TestBed.inject(BasicServiceService);
    app.project = project;
    spyOn(basicService, "getTaskLists").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(tasks);
      }));
    app.updataStatusGraph();
    expect(app.statusGraph).toEqual(2);
  });

  it('openGuideMain', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const app = fixture.componentInstance;
    let res = app.openGuideMain('standard');
    expect(res).toBeTruthy();
    let modals = document.querySelectorAll("d-modal");
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });
  });

  it('mainGuideCreateProject', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const app = fixture.componentInstance;
    app.toolBar.showCreateProjectDialog = function (e) {
      return e;
    };
    app.resultsOpenGuideMain = {
      modalInstance: {
        hide: function () {
        },
        zIndex: -1
      }
    }

    expect(app.mainGuideCreateProject()).toBeFalsy();

  });

  it('mainGuideOpenProject', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const app = fixture.componentInstance;
    app.toolBar.showOpenProjectButtonDialog = function (e) {
      return e;
    };
    app.resultsOpenGuideMain = {
      modalInstance: {
        hide: function () {
        },
        zIndex: -1
      }
    }
    expect(app.mainGuideOpenProject()).toBeFalsy();
  });

  it('updateProjectPath', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const app = fixture.componentInstance;
    app.updateProjectPath(1);
    expect(app.projectPath).toEqual(1);
  });

  it('reloadInsertComponent', () => {
    const fixture = TestBed.createComponent(MainComponent);
    const app = fixture.componentInstance;
    app.InsertPanels.loadFlowUnit = function (sd, dir, path) { }
    app.reloadInsertComponent();
    expect(app.InsertPanels).toBeTruthy();
    app.reloadInsertComponent("update");
    expect(app.InsertPanels).toBeTruthy();
  });

});