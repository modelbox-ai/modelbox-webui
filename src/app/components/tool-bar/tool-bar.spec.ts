import { HttpClient, HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { I18nService } from "@core/i18n.service";
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { BasicServiceService } from "@shared/services/basic-service.service";
import { DataServiceService } from "@shared/services/data-service.service";
import { DialogService } from "ng-devui/modal";
import { OverlayContainerModule, OverlayContainerRef } from "ng-devui/overlay-container";
import { Observable } from "rxjs";
import { dirs, folderList, formDataCreateFlowunit, graphSelectTableDataForDisplay, openProject, project, rowItem, solutions } from "./mock-data";
import { ToolBarComponent } from "./tool-bar.component";
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { templateTarget } from "@shared/services/mock-data";
import { dotSrc } from "../text-editor/mock-data";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../i18n/', '.json');
}

describe("ToolBarComponent", () => {

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
        ToolBarComponent
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

  it('should create the ToolBarComponent', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('init ToolBarComponent', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    localStorage.clear();
    localStorage.setItem("project", JSON.stringify(project));
    app.ngOnInit();
  });

  it('ngOnChanges', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    app.ngOnChanges(null);
  });

  it('loadGraphData', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    localStorage.clear();
    localStorage.setItem("project", JSON.stringify(project));
    let basicService = TestBed.inject(BasicServiceService);
    app.loadGraphData();
    spyOn(basicService, "openProject").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(openProject);
        expect(app.graphList).toBeTruthy();
        expect(app.graphSelectTableDataForDisplay).toBeTruthy();
      }));
  });

  it('loadGraphData toolBat.init', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    localStorage.clear();
    localStorage.setItem("project", JSON.stringify(project));
    let basicService = TestBed.inject(BasicServiceService);
    app.loadGraphData("toolBar.Init");
    spyOn(basicService, "openProject").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(openProject);
        expect(app.graphList).toBeTruthy();
        expect(app.graphSelectTableDataForDisplay).toBeTruthy();
      }));
  });

  it('getGraphNameFromGraph', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app.getGraphNameFromGraph(solutions.graph.graphconf)).toEqual("hello_world_diagraph");
  });

  it('closeInput', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
  });

  it('handleProjectDropDown: \
        clearCache, \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    localStorage.setItem("project", JSON.stringify(project));
    spyOn(Storage.prototype, 'clear')
    let e = { value: 6 }
    app.handleProjectDropDown(e);
    expect(Storage.prototype.clear).toHaveBeenCalled();

  });

  it('handleProjectDropDown: \
        sycnGraph, \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    localStorage.setItem("project", JSON.stringify(project));
    let basicService = TestBed.inject(BasicServiceService);
    spyOn(basicService, "openProject").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(openProject);
      }));
    let e = { value: 7 }
    app.handleProjectDropDown(e);
    expect(app.formData).toBeTruthy();

  });

  it('handleProjectDropDown: \
    showCreateProjectDialog, \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app.createProjectTemplate).toBeTruthy();
    let e = { value: 1 }
    app.showCreateProjectDialog = function (e) { };
    app.handleProjectDropDown(e);
  });

  it('handleProjectDropDown: \
    showOpenProjectButtonDialog, \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app.openProjectTemplate).toBeTruthy();
    let e = { value: 2 }
    app.showOpenProjectButtonDialog = function (e) { };
    app.handleProjectDropDown(e);
  });

  it('handleProjectDropDown: \
    showGraphSelectDialog, \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app.graphSelectTemplate).toBeTruthy();
    let e = { value: 4 }
    app.showGraphSelectDialog = function (e) { };
    app.handleProjectDropDown(e);
  });

  it('handleProjectDropDown: \
    handleNewGraphClick, \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app.graphSelectTemplate).toBeTruthy();
    let e = { value: 3 }

    app.handleProjectDropDown(e);

    let modals = document.querySelectorAll("d-modal");
    expect(modals).toBeTruthy();
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });
  });

  it('handleProjectDropDown: \
    handleNewGraphClick - clickOnOk \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app.graphSelectTemplate).toBeTruthy();
    let res = app.handleNewGraphClick(null);
    app.onNewGraphClickOk(res);
    expect(app.formData.graphName).toBeFalsy();

  });

  it('handleProjectDropDown: \
  saveAllProject - have not created project \
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    localStorage.clear();
    localStorage.setItem("project", JSON.stringify(project));
    let basicService = TestBed.inject(BasicServiceService);
    spyOn(basicService, "openProject").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(openProject);
      }));

    let e = { value: 5 }
    app.formDataCreateProject.name = "";

    spyOn(basicService, "saveAllProject");
    app.dotSrcWithoutLabel = "";
    app.handleProjectDropDown(e);
    expect(app.dotSrcWithoutLabel).toBeFalsy();

    let modals = document.querySelectorAll("d-modal");
    expect(modals).toBeTruthy();
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });
  });

  it('handleProjectDropDown: \
  saveAllProject\
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    spyOn(localStorage.__proto__, 'getItem').and.returnValue(JSON.stringify(project));
    let basicService = TestBed.inject(BasicServiceService);
    spyOn(basicService, "openProject").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(openProject);
      }));

    let e = { value: 5 }
    app.formDataCreateProject.name = "test";
    app.dotSrcWithoutLabel = "";
    spyOn(basicService, "saveAllProject").and.returnValue(
      new Observable(subscriber => {
        subscriber.next({ status: 201 });
      }));;
    app.handleProjectDropDown(e);
    expect(basicService.saveAllProject).toHaveBeenCalled();

    let modals = document.querySelectorAll("d-modal");
    expect(modals).toBeTruthy();
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });
  });

  it('handleFlowunitDropDown: \
  showCreateFlowunitDialog\
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app.createFlowunitTemplate).toBeTruthy();
    let e = { value: 1 }
    app.showCreateFlowunitDialog = function (e) { };
    app.handleFlowunitDropDown(e);

  });

  it('handleFlowunitDropDown: \
  refreshFlowunit\
        ', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    expect(app.refreshFlowunit).toBeTruthy();

  });

  it('langValueChange', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    let value;

    value = "python";
    app.langValueChange(value);
    expect(app.formDataCreateFlowunit.device).toEqual('cpu');
    expect(app.portInfo.device).toEqual('cpu');
    expect(app.formDataCreateFlowunit.type).toEqual('stream');
    expect(app.formDataCreateFlowunit.name).toEqual('flowunit');
    expect(app.formDataCreateFlowunit.port_infos).toEqual([]);

    value = "c++";
    app.langValueChange(value);
    expect(app.formDataCreateFlowunit.device).toEqual('cpu');
    expect(app.portInfo.device).toEqual('cpu');
    expect(app.formDataCreateFlowunit.type).toEqual('stream');
    expect(app.formDataCreateFlowunit.name).toEqual('flowunit');
    expect(app.formDataCreateFlowunit.port_infos).toEqual([]);

    value = "inference";
    app.currentDevice = "ascend";
    app.langValueChange(value);
    expect(app.formDataCreateFlowunit['virtual-type']).toEqual('acl');

    app.currentDevice = "cuda";
    app.langValueChange(value);
    expect(app.formDataCreateFlowunit['virtual-type']).toEqual('tensorflow');

    let service = TestBed.inject(DataServiceService);
    service.deviceTypes = ["cuda"];
    app.langValueChange(value);
    expect(app.formDataCreateFlowunit.device).toEqual('cuda');
    expect(app.portInfo.device).toEqual('cuda');

    service.deviceTypes = ["ascend"];
    app.langValueChange(value);
    expect(app.formDataCreateFlowunit.device).toEqual('ascend');
    expect(app.portInfo.device).toEqual('ascend');

    service.deviceTypes = ["cpu"];
    app.langValueChange(value);
    expect(app.formDataCreateFlowunit.device).toEqual('cpu');
    expect(app.portInfo.device).toEqual('cpu');

    value = "yolo";
    app.langValueChange(value);
    expect(app.formDataCreateFlowunit.device).toEqual('cpu');
    expect(app.portInfo.device).toEqual('cpu');
    expect(app.formDataCreateFlowunit['virtual-type']).toEqual('yolov3_postprocess');
    expect(app.formDataCreateFlowunit.name).toEqual('flowunit');
    expect(app.formDataCreateFlowunit.port_infos).toEqual([]);

  });

  it('deviceValueChange', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    app.deviceValueChange("cpu");
    expect(app.formDataCreateFlowunit.device).toEqual("cpu");
    expect(app.portInfo.device).toEqual("cpu");
  });

  it('transformDisplayData', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    app.deviceValueChange("cpu");
    expect(app.transformDisplayData("cpu".repeat(99)).indexOf("...")).toBeGreaterThan(-1);
  });

  it('onRowCheckChange', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    let obj = rowItem;
    app.graphSelectTableDataForDisplay = graphSelectTableDataForDisplay;
    app.onRowCheckChange(true, 0, -1, obj);
    expect(app.graphSelectTableData).toBeTruthy();
  });

  it('loadSolutionData', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    let basicService = TestBed.inject(BasicServiceService);
    spyOn(basicService, "queryTemplate").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(templateTarget);
      }));
    app.loadSolutionData();
    expect(app.optionSolutionList.length).toEqual(2);
  });

  it('deletePort', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    app.formDataCreateFlowunit.port_infos = [
      {
        "port_name": "",
        "port_type": "input",
        "data_type": "int",
        "device": "cpu"
      }];
    app.deletePort(null, 0);
    expect(app.formDataCreateFlowunit.port_infos.length).toEqual(0);
  });

  it('addPortLine', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    app.addPortLine("output");
    expect(app.portInfo['port_type']).toBeTruthy();
    expect(app.portInfo['port_name']).toBeTruthy();
    expect(app.out_num).toEqual(2);
    app.addPortLine("input");
    expect(app.portInfo['port_type']).toBeTruthy();
    expect(app.portInfo['port_name']).toBeTruthy();
    expect(app.in_num).toEqual(2);
    app.addPortLine("output");
    expect(app.out_num).toEqual(3);
  });

  it('onCheckboxPerfTraceEnableChange', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    app.onCheckboxPerfTraceEnableChange(false);
    expect(app.formData.perfTraceEnable).toBeFalse();
  });

  it('initFormData', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    app.initFormData();
    expect(app.formData).toBeTruthy();
  });

  it('register handler', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    let e = "test";
    app.onUndoButtonClick = function (e) { };
    spyOn(app, "onUndoButtonClick");
    app.handleUndoButtonClick(e);
    expect(app.onUndoButtonClick).toHaveBeenCalled();

    app.onRedoButtonClick = function (e) { };
    spyOn(app, "onRedoButtonClick");
    app.handleRedoButtonClick(e);
    expect(app.onRedoButtonClick).toHaveBeenCalled();

    app.onZoomInButtonClick = function (e) { };
    spyOn(app, "onZoomInButtonClick");
    app.handleZoomInButtonClick(e);
    expect(app.onZoomInButtonClick).toHaveBeenCalled();

    app.onZoomOutButtonClick = function (e) { };
    spyOn(app, "onZoomOutButtonClick");
    app.handleZoomOutButtonClick(e);
    expect(app.onZoomOutButtonClick).toHaveBeenCalled();

    app.onZoomFitButtonClick = function (e) { };
    spyOn(app, "onZoomFitButtonClick");
    app.handleZoomFitButtonClick(e);
    expect(app.onZoomFitButtonClick).toHaveBeenCalled();

    app.onZoomResetButtonClick = function (e) { };
    spyOn(app, "onZoomResetButtonClick");
    app.handleZoomResetButtonClick(e);
    expect(app.onZoomResetButtonClick).toHaveBeenCalled();

    app.onNewButtonClick = function (e) { };
    spyOn(app, "onNewButtonClick");
    app.handleNewButtonClick(e);
    expect(app.onNewButtonClick).toHaveBeenCalled();

    app.onSwitchDirectionButtonClick = function (e) { };
    spyOn(app, "onSwitchDirectionButtonClick");
    app.handleSwitchDirectionButtonClick(e);
    expect(app.onSwitchDirectionButtonClick).toHaveBeenCalled();

    app.onRunButtonClick = function (e) { };
    spyOn(app, "onRunButtonClick");
    app.handleRunButtonClick(e);
    expect(app.onRunButtonClick).toHaveBeenCalled();

    app.onStopButtonClick = function (e) { };
    spyOn(app, "onStopButtonClick");
    app.handleStopButtonClick(e);
    expect(app.onStopButtonClick).toHaveBeenCalled();

    app.onRestartButtonClick = function (e) { };
    spyOn(app, "onRestartButtonClick");
    app.handleRestartButtonClick(e);
    expect(app.onRestartButtonClick).toHaveBeenCalled();

    app.onCreateProjectButtonClick = function (e) { };
    spyOn(app, "onCreateProjectButtonClick");
    app.handleCreateProjectButtonClick(e);
    expect(app.onCreateProjectButtonClick).toHaveBeenCalled();

  });

  it('initFormDataCreateFlowunit', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    app.initFormDataCreateFlowunit();
    expect(app.in_num).toEqual(1);
    expect(app.out_num).toEqual(1);
    expect(app.formDataCreateFlowunit).toBeTruthy();
  });

  it('cellClick', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    let e = {
      rowIndex: 2,
      rowItem: {
        folder: "sss",
        isProject: "✓"
      }
    }
    app.openproject_path = "/root";
    app.cellClick(e);
    expect(app.openproject_path).toEqual("/root/sss");
  });

  it('onClickCard', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    let e = {
      desc: "A helloworld REST API service example project template for modelbox",
      dirname: "hello_world",
      name: "helloworld"
    }
    app.onClickCard(e, null);
    expect(app.formDataCreateProject.template).toEqual("hello_world");
  });

  it('searchDirectory', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    let basicService = TestBed.inject(BasicServiceService);
    spyOn(basicService, "loadTreeByPath").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(dirs);
      }));
    app.searchDirectory("/root");
    expect(app.folderList.length).toBeGreaterThan(0);
  });

  it('onPathSelect', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    app.onPathSelect("/root");
    expect(app.openproject_path).toBeTruthy();
  });

  it('openProject', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;

    let basicService = TestBed.inject(BasicServiceService);
    app.folderList = folderList;
    app.openproject_path = openProject.project_path;
    spyOn(basicService, "openProject").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(openProject);
      }));
    app.showGraphSelectDialog = function (x) { };
    app.openProject(null);
    expect(app.currentGraph.graph.graphconf).toBeTruthy();

    let modals = document.querySelectorAll("d-modal");
    expect(modals).toBeTruthy();
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });
  });

  it('formatDotSrc', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    let text = dotSrc;
    let newDotSrc = app.formatDotSrc(text);
    expect(newDotSrc).toBeTruthy();
  });

  it('showSaveAsDialog', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;
    let basicService = TestBed.inject(BasicServiceService);

    spyOn(basicService, "openProject").and.returnValue(
      new Observable(subscriber => {
        subscriber.next(openProject);
      }));

    app.showSaveAsDialog();
    let modals = document.querySelectorAll("d-modal");
    expect(modals).toBeTruthy();
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });

  });

  it('openDialog', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;

    app.openDialog();
    let modals = document.querySelectorAll("d-modal");
    expect(modals).toBeTruthy();
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });
  });

  it('createProjectParam', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;

    let params = app.createProjectParam(project);
    expect(params["job_graph"]).toBeTruthy();

  });

  it('infoCreateProjectFirst', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;

    expect(app.infoCreateProjectFirst()).toBeFalse();
    app.formDataCreateProject["name"] = "test";
    expect(app.infoCreateProjectFirst()).toBeTrue();
  });

  it('showGraphDescriptionDialog', () => {
    const fixture = TestBed.createComponent(ToolBarComponent);
    const app = fixture.componentInstance;

    app.showGraphDescriptionDialog(app.graphDescriptionTemplate);
    let modals = document.querySelectorAll("d-modal");
    expect(modals).toBeTruthy();
    modals.forEach((m) => {
      m.setAttribute("style", "display:none");
    });
  });

});
