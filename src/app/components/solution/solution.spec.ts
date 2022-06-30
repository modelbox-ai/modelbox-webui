import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SolutionComponent } from "./solution.component";
import { I18nService } from '@core/i18n.service';
import { DataServiceService } from "@shared/services/data-service.service";
import { OverlayContainerRef } from "ng-devui/overlay-container";
import { DocumentRef } from "ng-devui";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}

describe("SolutionComponent", () => {

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
    }).compileComponents();
  });

  it('should create the SolutionComponent', () => {
    const fixture = TestBed.createComponent(SolutionComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});