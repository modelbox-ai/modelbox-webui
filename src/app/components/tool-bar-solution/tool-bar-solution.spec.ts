import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed, tick } from "@angular/core/testing";
import { I18nService } from "@core/i18n.service";
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DataServiceService } from "@shared/services/data-service.service";
import { DialogService } from "ng-devui/modal";
import { OverlayContainerModule, OverlayContainerRef } from "ng-devui/overlay-container";
import { ToolBarSolutionComponent } from "./tool-bar-solution.component";
import { solutionList, solutionListTarget } from "./mock-data";
import { BasicServiceService } from "@shared/services/basic-service.service";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}

describe("ToolBarSolutionComponent", () => {
  let service: BasicServiceService;
  let httpTestingController: HttpTestingController;

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
        HttpClientTestingModule,
        OverlayContainerModule
      ],
      declarations: [
        ToolBarSolutionComponent
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
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(BasicServiceService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should create the ToolBarSolutionComponent', () => {
    const fixture = TestBed.createComponent(ToolBarSolutionComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('loadSolutionData', () => {
    const fixture = TestBed.createComponent(ToolBarSolutionComponent);
    const app = fixture.componentInstance;
    let response = solutionList;
    service.querySolutionList().subscribe(data => {
        let solution = data.demo_list;
        solution.forEach((item) => {
          let obj = { demo: '', desc: '', graphfile: '', name: '' };
          obj.demo = item.demo;
          obj.desc = item.desc;
          obj.graphfile = item.graphfile;
          obj.name = item.name;
          app.solutionList.push(obj);
        });
        expect(app.solutionList).toEqual(solutionListTarget);
    });
    
    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      "/editor/demo"
    );
    // Assert that the request is a GET.
    expect(req.request.method).toEqual("GET");
    // Respond with this data when called
    req.flush(response);
    
  });

});
