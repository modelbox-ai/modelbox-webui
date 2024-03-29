import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { I18nService } from "@core/i18n.service";
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DataServiceService } from "@shared/services/data-service.service";
import { OverlayContainerModule, OverlayContainerRef } from "ng-devui/overlay-container";
import { AttributePanelComponent } from "./attribute-panel.component";
import { DialogService } from "ng-devui";
import { context_origin, context_target, config, unit_type_target, config_initialed, unit_example, unit_options_example, dotGraph_example } from "./mock-data";
import { HttpTestingController } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";

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
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  });

  it('should create the AttributePanelComponent', () => {
    const fixture = TestBed.createComponent(AttributePanelComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('format description from code to UI, handleTipText && handlePortDetail', () => {
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
    app.unitType.init();
    app.unitOptions.init();
    expect(app.unitOptions.data.length).toEqual(0);
  });

  it('initConfig', () => {
    const fixture = TestBed.createComponent(AttributePanelComponent);
    const app = fixture.componentInstance;
    app.config = config;
    app.initConfig(config);
    expect(app.newName).toBeTruthy();
    expect(app.config["attributes"]).toBeTruthy();
  });

  it('attributeModel.blur', () => {
    const fixture = TestBed.createComponent(AttributePanelComponent);
    const app = fixture.componentInstance;
    app.config = config;
    app.newName = "httpserver_sync_receive";
    app.unit = unit_example;
    app.unitType = unit_type_target;
    app.unitOptions = unit_options_example;
    app.newName = "test";
    expect(((app.newName !== config.name) && (app.unit != undefined))).toBeTruthy();
    app.dotGraph = dotGraph_example;
    app.onNodeAttributeChange = function (x, y) { };
    app.attributeModel.blur();
    expect(app.config.name).toEqual(app.newName);
  });

  it('ngOnChanges', () => {
    const fixture = TestBed.createComponent(AttributePanelComponent);
    const app = fixture.componentInstance;
    app.config = config;
    app.ngOnChanges(null);
    expect(app.newName).toBeTruthy();
    expect(app.config["attributes"]).toBeTruthy();

    let modals = document.querySelectorAll("d-modal");
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });
  });

  it('ngOnInit', () => {
    const fixture = TestBed.createComponent(AttributePanelComponent);
    const app = fixture.componentInstance;
    app.config = config;
    app.ngOnInit();
    expect(app.newName).toBeTruthy();
    expect(app.config["attributes"]).toBeTruthy();

    let modals = document.querySelectorAll("d-modal");
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });
  });

  it('ngOnDestroy', () => {
    const fixture = TestBed.createComponent(AttributePanelComponent);
    const app = fixture.componentInstance;
    app.config = config;
    app.changedValue = false;
    app.ngOnDestroy();
    expect(app.config).toBeTruthy();

    app.changedValue = true;
    app.onNodeAttributeChange = function (x, y) { };
    app.ngOnDestroy();
    expect(app.config).toBeFalsy();

  });

  it('handleAdvance', () => {
    const fixture = TestBed.createComponent(AttributePanelComponent);
    const app = fixture.componentInstance;
    app.config = config;
    app.unit = unit_example;
    app.handleAdvance(config, "deviceid");
    expect(app.unit['advance']).toBeTruthy();
  });

});
