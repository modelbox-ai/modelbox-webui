import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nService } from '@core/i18n.service';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { DataServiceService } from '@shared/services/data-service.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OverlayContainerRef } from 'ng-devui/overlay-container';

import { FirstComponent } from './first.component';
import { HeaderMainComponent } from '../header-main/header-main.component';
import { OverlayContainerModule } from 'ng-devui/overlay-container';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}

describe('FirstComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
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
        FirstComponent,
        HeaderMainComponent
      ],
      providers: [
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

  it('should create the FirstComponent', () => {
    const fixture = TestBed.createComponent(FirstComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should import DataService', () => {
    const dataService = TestBed.get(DataServiceService);
    expect(dataService).toBeTruthy();
  });

  it('currentPage should be ""', () => {
    const dataService = TestBed.get(DataServiceService);
    expect(dataService.getCurrentPage()).toEqual("");
  });
});
