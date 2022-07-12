import { TestBed } from "@angular/core/testing";
import { GraphComponent } from "./graph.component";
import { I18nService } from '@core/i18n.service';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { DataServiceService } from '@shared/services/data-service.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OverlayContainerRef } from 'ng-devui/overlay-container';
import { OverlayContainerModule } from 'ng-devui/overlay-container';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DialogService } from "ng-devui";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}

describe("GraphComponent", () => {

  let service: DataServiceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GraphComponent
      ],
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

    service = TestBed.inject(DataServiceService);
  });

  it('should create the GraphComponent', () => {
    const fixture = TestBed.createComponent(GraphComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});