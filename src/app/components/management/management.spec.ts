import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef, ViewChild } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { I18nService } from "@core/i18n.service";
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { BasicServiceService } from "@shared/services/basic-service.service";
import { DataServiceService } from "@shared/services/data-service.service";
import { DialogService } from "ng-devui";
import { OverlayContainerModule, OverlayContainerRef } from "ng-devui/overlay-container";
import { Observable } from "rxjs";
import { ManagementComponent } from "./management.component";
import { demo_list, directory, taskData } from "./mock-data";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}

describe("ManagementComponent", () => {

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
        OverlayContainerModule,
        BrowserAnimationsModule,
        NoopAnimationsModule
      ],
      declarations: [
        ManagementComponent
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
  });

  it('should create the ManagementComponent', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('handleFileSelect & _handleReaderLoaded', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    let file = { target: { files: [new Blob()] } };
    app.handleFileSelect(file);
    expect(file && file.target.files).toBeTruthy();
  });

  it('handleChange & handleChange1', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    let value = "test";
    app.handleChange(value);
    app.handleChange1(value);
    expect(app.jsonSrc && app.jsonSrcObj && app.responseSrc).toBeTruthy();
  });

  it('beautifyJson', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    app.jsonSrcObj = { "test": "txt" };
    app.beautifyJson();
    expect(app.jsonSrc).toBeTruthy();
  });

  it('templateChange', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    let value = "helloworld";
    app.demo_list = demo_list;
    app.templateChange(value);
    app.jsonSrcObj = { "test": "txt" };
    app.beautifyJson();
    expect(app.jsonSrc).toBeTruthy();
  });

  it('searchDirectory', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    let basicService = TestBed.inject(BasicServiceService);
    app.openproject_path = "/root/pro1";
    spyOn(basicService, "loadTreeByPath").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(directory);
      }));
    app.searchDirectory();
    expect(app.folderList).toBeTruthy();
  });

  it('cellClick && onPathSelect', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    spyOn(app, 'searchDirectory');
    let e = {
      rowIndex: 0
    }
    app.openproject_path = "/root/pro1";
    app.cellClick(e);
    expect(app.searchDirectory).toHaveBeenCalled();
    let path = "/root/pro1";
    app.onPathSelect(path);
    expect(app.searchDirectory).toHaveBeenCalled();
  });

  it('openstandardDialog', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    let res = app.openstandardDialog('standard');
    expect(res).toBeTruthy();
    let modals = document.querySelectorAll("d-modal");
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    })
  });

  it('radioValueChange', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    app.responseBody = "body";
    app.radioValueChange('Body');
    expect(app.responseSrc).toEqual(app.responseBody);
    app.responseHeader = "header";
    app.radioValueChange('Header');
    expect(app.responseSrc).toEqual(app.responseHeader);
  });

  it('handleClear', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    expect(app.handleClear()).toBeFalsy();
  });

  it('showDebugPanel', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    const debug = fixture.debugElement.componentInstance.debugRef;
    let res = app.showDebugPanel(debug);
    expect(res).toBeTruthy();
    let modals = document.querySelectorAll("d-modal");
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });
  });

  it('customUploadEvent', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    expect(app.singleuploadDrag).toBeFalsy();
  });

  it('handleSend', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    let basicService = TestBed.inject(BasicServiceService);
    app.selectMethod = "get";
    app.url = "/root/pro1";
    app.jsonSrc = "test";
    app.responseBody = '"test":"hello"';
    spyOn(basicService, "customRequest").and.returnValue(
      new Observable(subscriber => {
        subscriber.next({
          body: {
            status: 200,
            headers: [],
            body: {}
          }
        });
      }));
    app.handleSend();
    expect(basicService.customRequest).toHaveBeenCalled();
  });

  it('beforeEditEnd', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    let rowItem = {
      ischecked: true,
      key: "显卡",
      nameEdit: true,
      value: ""
    }
    let field = "key";
    app.dataHeaders = [rowItem];
    app.beforeEditEnd(rowItem, field);
    expect(app.dataHeaders.length).toBeGreaterThan(1);
  });

  it('handleDelete', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    let rowItem = {
      ischecked: true,
      key: "显卡",
      nameEdit: true,
      value: ""
    }
    app.dataHeaders = [rowItem];
    app.handleDelete(0);
    expect(app.dataHeaders.length).toEqual(1);
  });

  it('onRowCheckChange', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    let checked = false;
    let rowIndex = 0;
    let nestedIndex = -1
    let rowItem = {
      ischecked: true,
      key: "",
      value: "",
      job_id: 1
    }
    app.taskData = taskData;
    app.onRowCheckChange(checked, rowIndex, nestedIndex, rowItem);
    expect(app.taskData.srcData.data[0].checked).toBeFalse();
  });

  it('getTaskslists', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    let basicService = TestBed.inject(BasicServiceService);
    spyOn(basicService, "getTaskLists").and.returnValue(
      new Observable(subscriber => {
        subscriber.next({
          job_list: [
            {
              "job_error_msg": "",
              "job_id": "hello_world_diagraph",
              "job_status": "RUNNING"
            }
          ]
        });
      }));
    app.tableData = {
      "srcData": {
        "data": []
      }
    }
    app.getTaskslists();
    expect(app.tableData.srcData.data[0].job_status_value).toBeTruthy();
  });

  it('deleteData', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    let res = app.deleteData({
      "job_error_msg": "",
      "job_id": "hello_world_diagraph",
      "job_status": "RUNNING",
      "job_status_value": "任务正在执行"
    });
    expect(res).toBeTruthy();
    let modals = document.querySelectorAll("d-modal");
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    })
  });

  it('deleteTask', () => {
    const fixture = TestBed.createComponent(ManagementComponent);
    const app = fixture.componentInstance;
    let basicService = TestBed.inject(BasicServiceService);
    spyOn(basicService, "deleteTask").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(null);
      }));

    app.deleteTask({
      "job_error_msg": "",
      "job_id": "hello_world_diagraph",
      "job_status": "RUNNING",
      "job_status_value": "任务正在执行"
    });
    expect(app.tableData.srcData.data.length).toEqual(0);
  });
});
