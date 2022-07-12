import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { I18nService } from "@core/i18n.service";
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DataServiceService } from "@shared/services/data-service.service";
import { OverlayContainerModule, OverlayContainerRef } from "ng-devui/overlay-container";
import { TextEditorComponent } from "./text-editor.component";
import { AceComponent } from 'ngx-ace-wrapper';
import { dotSrc } from "./mock-data";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}

describe("TextEditorComponent", () => {

  const componentRef = jasmine.createSpyObj('AceComponent', {}, {
    directiveRef: {
      ace: (function () {
        return {
          container: {
            style: {
              lineHeight: 0
            }
          },
          setOptions: new Function()
        }
      })
    },

  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TextEditorComponent,
        AceComponent
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
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA, 
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  });

  it('should create the TextEditorComponent', () => {
    const fixture = TestBed.createComponent(TextEditorComponent);
    const app = fixture.componentInstance;

    app.componentRef = componentRef;
    app.registerUndo = (function () { });
    app.registerRedo = (function () { });
    app.registerUndoReset = (function () { });
    app.registerResize = (function () { });
    app.registerSwitchDirectionButtonClick = (function () { });

    app.ngAfterViewInit();
    expect(app).toBeTruthy();
    expect(app.editor).toBeTruthy();
    expect(app.editor.container.style.lineHeight).toEqual(1.8);

    expect(app.undo).toBeTruthy();
    expect(app.redo).toBeTruthy();
    expect(app.resetUndoStack).toBeTruthy();
    expect(app.resize).toBeTruthy();
    expect(app.switchDirection).toBeTruthy();
    expect(app.config).toBeTruthy();
    expect(app.config.printMarginColumn).toEqual(120);
  });

  it('should switchComponent', () => {
    const fixture = TestBed.createComponent(TextEditorComponent);
    const app = fixture.componentInstance;
    app.dotSrc = dotSrc;
    app.switchDirection();
    expect(app.dotSrc.indexOf('rankdir=LR')).toBeGreaterThan(-1);
    app.switchDirection();
    expect(app.dotSrc.indexOf('rankdir=VERTICLE')).toBeGreaterThan(-1);
    app.switchDirection();
    expect(app.dotSrc.indexOf('rankdir=LR')).toBeGreaterThan(-1);
  });
});