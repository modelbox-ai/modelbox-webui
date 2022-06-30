import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { I18nService } from "@core/i18n.service";
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DataServiceService } from "@shared/services/data-service.service";
import { OverlayContainerModule, OverlayContainerRef } from "ng-devui/overlay-container";
import { InsertPanelsComponent } from "./insert-panels.component";

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
      ],
    }).compileComponents();
  });

  it('should create the InsertPanelsComponent', () => {
    const fixture = TestBed.createComponent(InsertPanelsComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});