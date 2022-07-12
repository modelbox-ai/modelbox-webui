import { TestBed } from "@angular/core/testing";
import { DialogService } from "ng-devui/modal";
import { MainComponent } from "./main.component";
import { OverlayContainerModule } from 'ng-devui/overlay-container';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { I18nService } from '@core/i18n.service';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { DataServiceService } from '@shared/services/data-service.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OverlayContainerRef } from 'ng-devui/overlay-container';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";

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
    expect(app).toBeTruthy();
  });

});