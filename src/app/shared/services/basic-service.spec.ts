import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { BasicServiceService } from './basic-service.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { solutionList, solutionListTarget, loadTreeByPath } from "./mock-data";

describe('BasicServiceService', () => {

  let service: BasicServiceService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        BasicServiceService,
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(BasicServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('queryRootPath', () => {
    let response = "/root";
    service.queryRootPath().subscribe(data => {
      expect(data).toBeTruthy();
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      "/editor/basic-info"
    );
    // Assert that the request is a GET.
    expect(req.request.method).toEqual("GET");
    // Respond with this data when called
    req.flush(response);

  });

  it('loadTreeByPath', () => {
    let response = loadTreeByPath;
    service.loadTreeByPath().subscribe(data => {
      expect(data).toEqual(loadTreeByPath);
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      "/editor/project/list/?path=/"
    );
    // Assert that the request is a GET.
    expect(req.request.method).toEqual("GET");
    // Respond with this data when called
    req.flush(response);

  });

  it('querySolutionList', () => {
    let response = solutionList;
    service.querySolutionList().subscribe(data => {

      expect(data.demo_list).toEqual(solutionListTarget);
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