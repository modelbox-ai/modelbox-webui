import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { I18nService } from "@core/i18n.service";
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DataServiceService } from "@shared/services/data-service.service";
import { OverlayContainerModule, OverlayContainerRef } from "ng-devui/overlay-container";
import { AttributePanelComponent } from "./attribute-panel.component";
import { DialogService } from "ng-devui";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}

describe("AttributePanelComponent", () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AttributePanelComponent
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
        I18nService,
        DataServiceService,
        OverlayContainerRef,
        TranslateService,
        TranslateStore,
        DialogService
      ]
    }).compileComponents();
  });

  it('should create the AttributePanelComponent', () => {
    const fixture = TestBed.createComponent(AttributePanelComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});