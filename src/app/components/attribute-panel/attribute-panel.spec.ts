import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { I18nService } from "@core/i18n.service";
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DataServiceService } from "@shared/services/data-service.service";
import { OverlayContainerModule, OverlayContainerRef } from "ng-devui/overlay-container";
import { AttributePanelComponent } from "./attribute-panel.component";
import { DialogService } from "ng-devui";
import { context_origin, context_target, unit_target, config, unit_http_receive } from "./mock-data";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}

describe("AttributePanelComponent", () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
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

  it('format descryption from code to UI, handleTipText', () => {
    const fixture = TestBed.createComponent(AttributePanelComponent);
    const app = fixture.componentInstance;
    let context = context_origin;
    expect(app.handleTipText(context)).toEqual(context_target);
  });

  it('initUnit with config', () => {
    const fixture = TestBed.createComponent(AttributePanelComponent);
    const app = fixture.componentInstance;
    app.initUnit(config);
    expect(app.unit).toBeTruthy();
    expect(app.unit.inputports).toBeFalsy();
    expect(app.unit.options).toBeFalsy();
    expect(app.unit.outputports).toBeFalsy();
  });

});