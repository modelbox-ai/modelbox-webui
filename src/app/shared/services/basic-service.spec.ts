import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule, HttpErrorResponse, HttpParams, HttpRequest } from '@angular/common/http';
import { BasicServiceService } from './basic-service.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  solutionList,
  solutionListTarget,
  loadTreeByPath,
  templateTarget,
  paramQueryData,
  flowInfo,
  tasks,
  demoTarget,
  paramCreateProject,
  paramCreateFlowunit,
  paramCreateTask,
  openProjectData,
} from "./mock-data";

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
      fail
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      (request) => request.url === "/editor/basic-info"
    );

    expect(req.request.method).toEqual("GET");
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    // Respond with this data when called
    req.flush(response);
    httpTestingController.verify();

  });

  it('loadTreeByPath', () => {
    let response = loadTreeByPath;
    service.loadTreeByPath().subscribe(data => {
      expect(data).toEqual(loadTreeByPath);
      fail
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      (request) => request.url === "/editor/project/list/?path=/"
    );
    // Assert that the request is a GET.
    expect(req.request.method).toEqual("GET");
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    // Respond with this data when called
    req.flush(response);
    httpTestingController.verify();

  });

  it('querySolutionList', () => {
    let response = solutionList;
    service.querySolutionList().subscribe(data => {
      expect(data.demo_list).toEqual(solutionListTarget);
      fail
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      (request) => request.url === "/editor/demo"
    );
    // Assert that the request is a GET.
    expect(req.request.method).toEqual("GET");
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    // Respond with this data when called
    req.flush(response);
    httpTestingController.verify();

  });

  it('queryTemplate', () => {
    let response = templateTarget;
    service.queryTemplate().subscribe(data => {
      expect(data.project_template_list).toEqual(templateTarget.project_template_list);
      fail
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      (request) => request.url === "/editor/project/template"
    );
    // Assert that the request is a GET.
    expect(req.request.method).toEqual("GET");
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    // Respond with this data when called
    req.flush(response);
    httpTestingController.verify();

  });

  it('queryData', () => {
    let response = flowInfo;
    let param = new HttpParams({ fromObject: paramQueryData });
    service.queryData({ params: param }).subscribe(data => {
      expect(data.devices).toBeTruthy();
      expect(data.flowunits).toBeTruthy();
      fail
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      (request) => request.url === "/editor/flow-info"
    );

    expect(req.request.method).toEqual("PUT");
    expect(req.cancelled).toBeFalsy();
    expect(req.request.body.params).toEqual(param);
    expect(req.request.responseType).toEqual('json');
    // Respond with this data when called
    req.flush(response);
    httpTestingController.verify();

  });

  it('getTaskLists', () => {
    let response = tasks;
    service.getTaskLists().subscribe(data => {
      expect(data.job_list).toEqual(tasks.job_list);
      fail
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      "/v1/modelbox/job/list/all"
    );

    expect(req.request.method).toEqual("GET");
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    // Respond with this data when called
    req.flush(response);
    httpTestingController.verify();

  });

  it('deleteTask', () => {
    let param = "hello_world_diagraph.toml"
    service.deleteTask(param).subscribe(data => {
      expect(data).toBeFalsy();
      fail
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      "/v1/modelbox/job/list/" + param
    );

    expect(req.request.method).toEqual("DELETE");
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    // Respond with this data when called
    req.flush('');
    httpTestingController.verify();

  });

  it('querySolution', () => {
    let param = "hello_world_diagraph/hello_world_diagraph.toml"
    let response = demoTarget;
    service.querySolution(param).subscribe(data => {
      expect(data).toEqual(demoTarget);
      fail
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      (request) => request.url === "/editor/demo/" + param
    );
    expect(req.request.method).toEqual("GET");
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    // Respond with this data when called
    req.flush(response);
    httpTestingController.verify();

  });

  it('searchTask', () => {
    let param = "hello_world_diagraph.toml"
    let response = tasks.job_list[0];
    service.searchTask(param).subscribe(data => {
      expect(data).toEqual(response);
      fail
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      "/v1/modelbox/job/" + param
    );

    expect(req.request.method).toEqual("GET");
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    // Respond with this data when called
    req.flush(response);
    httpTestingController.verify();

  });

  it('createTask', () => {
    let response = {
      code: "Success",
      msg: "Success"
    };
    let paramTask = JSON.stringify(paramCreateTask)
    let param = new HttpParams({ fromString: paramTask });
    service.createTask({ params: param }).subscribe(data => {
      expect(data?.body.code).toBeTruthy();
      expect(data?.body.msg).toBeTruthy();
      fail
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      (request) => request.url === "/v1/modelbox/job"
    );

    expect(req.request.method).toEqual("PUT");
    expect(req.cancelled).toBeFalsy();
    expect(req.request.body.params).toEqual(param);
    expect(req.request.responseType).toEqual('json');
    // Respond with this data when called
    req.flush(response);
    httpTestingController.verify();

  });

  it('saveAllProject', () => {
    let response = {
      code: "Success",
      msg: "Success"
    };
    let paramTask = JSON.stringify(paramCreateTask)
    let param = new HttpParams({ fromString: paramTask });
    service.saveAllProject({ params: param }).subscribe(data => {
      expect(data?.body.code).toBeTruthy();
      expect(data?.body.msg).toBeTruthy();
      fail
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      (request) => request.url === "/editor/graph"
    );

    expect(req.request.method).toEqual("PUT");
    expect(req.cancelled).toBeFalsy();
    expect(req.request.body.params).toEqual(param);
    expect(req.request.responseType).toEqual('json');
    // Respond with this data when called
    req.flush(response);
    httpTestingController.verify();

  });

  it('createProject', () => {
    let response = {
      code: "Success",
      msg: "Success"
    };
    let param = new HttpParams({ fromObject: paramCreateProject });
    service.createProject({ params: param }).subscribe(data => {
      expect(data?.body.code).toBeTruthy();
      expect(data?.body.msg).toBeTruthy();
      fail
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      (request) => request.url === "/editor/project/create"
    );

    expect(req.request.method).toEqual("PUT");
    expect(req.cancelled).toBeFalsy();
    expect(req.request.body.params).toEqual(param);
    expect(req.request.responseType).toEqual('json');
    // Respond with this data when called
    req.flush(response);
    httpTestingController.verify();

  });

  it('createFlowunit', () => {
    let response = {
      code: "Success",
      msg: "Success"
    };
    let param = new HttpParams({ fromObject: paramCreateFlowunit })
      .append("input", "[{'name': 'input1','device': 'cpu'}]");
    service.createFlowunit({ params: param }).subscribe(data => {
      expect(data?.body.code).toBeTruthy();
      expect(data?.body.msg).toBeTruthy();
      fail
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      (request) => request.url === "/editor/flowunit/create"
    );

    expect(req.request.method).toEqual("PUT");
    expect(req.cancelled).toBeFalsy();
    expect(req.request.body.params).toEqual(param);
    expect(req.request.responseType).toEqual('json');
    // Respond with this data when called
    req.flush(response);
    httpTestingController.verify();

  });

  it('openProject', () => {
    let param = "/root/projectName"
    let response = openProjectData;
    service.openProject(param).subscribe(data => {
      expect(data).toEqual(response);
      fail
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      "/editor/project/?path=" + param
    );

    expect(req.request.method).toEqual("GET");
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    // Respond with this data when called
    req.flush(response);
    httpTestingController.verify();

  });

  it('customRequest', () => {
    let response = {
      code: "Success",
      msg: "Success"
    };
    let method = "POST";
    let route = "http://0.0.0.0:8190/v1/mnist_test";
    let pram = "\"{\\n  \\\"image_base64\\\": \\\"\\\"\\n}\\n\"";
    ;
    service.customRequest(method, route, pram).subscribe(data => {
      expect(data).toBeTruthy();
      fail
    });

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
      (request) => request.url === "/editor/postman"
    );

    expect(req.request.method).toEqual("POST");
    expect(req.cancelled).toBeFalsy();
    expect(req.request.body).toBeTruthy();
    expect(req.request.responseType).toEqual('json');
    // Respond with this data when called
    req.flush(response);
    httpTestingController.verify();

  });

  it('httpclient 404 error test case', () => {
    const errormsg = 'mock 404 error';
    service.queryRootPath().subscribe((get) => {
      fail('fail with error 404');
    },
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
        expect(error.error).toEqual(errormsg);
      });

    const req = httpTestingController.expectOne('/editor/basic-info');
    req.flush(errormsg, { status: 404, statusText: 'Not Found' });
    httpTestingController.verify();

  })

});
