import { TestBed } from "@angular/core/testing";
import { DialogService, ModalService } from "ng-devui/modal";
import { MainComponent } from "./main.component";
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

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}


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
        OverlayContainerModule
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

});