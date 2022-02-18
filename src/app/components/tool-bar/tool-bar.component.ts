/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Input, Output, ViewChild, EventEmitter, ElementRef, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { I18nService } from '@core/i18n.service';
import { DialogService } from 'ng-devui/modal';
import { ToastService } from 'ng-devui/toast';
import { ModalSaveAsComponent } from '../modal-save-as/modal-save-as.component';
import { FormLayout } from 'ng-devui/form';
import { DataTableComponent, TableWidthConfig } from 'ng-devui/data-table';
import { BasicServiceService } from '@shared/services/basic-service.service';
import { DataServiceService } from '@shared/services/data-service.service';

declare const require: any
@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.less'],
})

export class ToolBarComponent {
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  @ViewChild('tab1') tab1: ElementRef;
  @ViewChild('tab2') tab2: ElementRef;
  @ViewChild('project') projectRef: ElementRef;
  @ViewChild('flowunit') flowunitRef: ElementRef;
  @ViewChild('graph') graphRef: ElementRef;

  @Input() hasUndo: boolean;
  @Input() hasRedo: boolean;
  @Input() graphs: any = {};
  @Input() onUndoButtonClick: any;
  @Input() onRedoButtonClick: any;
  @Input() onZoomInButtonClick: any;
  @Input() onZoomOutButtonClick: any;
  @Input() onZoomResetButtonClick: any;
  @Input() onZoomFitButtonClick: any;
  @Input() onConfirmNameChange: any;
  @Input() onNewButtonClick: any;
  @Input() onSwitchButtonClick: any;
  @Input() onSwitchDirectionButtonClick: any;
  @Input() onCreateProjectButtonClick: any;
  oldName: string = '';
  @Input() showGraphSettingDialog: any;
  @Input() showSelectDialog: any;
  @Input() showSolutionDialog: any;
  @Input() showCreateProjectDialog: any;
  @Input() showOpenProjectButtonDialog: any;
  @Input() showCreateFlowunitDialog: any;
  @Input() onRunButtonClick: any;

  @Input() projectInfo: any;

  @Output() graphsEmmiter = new EventEmitter();
  @Output() refreshEmmiter = new EventEmitter();
  backSvg = require("../../../assets/undo.svg");
  backDisabledSvg = require("../../../assets/undo_disabled.svg");
  redoSvg = require("../../../assets/redo.svg");
  redoDisabledSvg = require("../../../assets/redo_disabled.svg");
  zoomInSvg = require("../../../assets/zoom-in.svg");
  zoomOutSvg = require("../../../assets/zoom-out.svg");
  zoomResetSvg = require("../../../assets/zoom-reset.svg");
  zoomFitSvg = require("../../../assets/zoom-out-map.svg");
  switchSvg = require("../../../assets/switch.svg");
  runGraphSvg = require("../../../assets/run-graph.svg");
  defaultPerfDir: string = '/tmp/modelbox/perf/';
  defaultDir: string = '/usr/local/lib';

  activeBasic: boolean = true;
  activePerf: boolean = false;
  layoutDirection: FormLayout = FormLayout.Horizontal;
  graphSelectTableData: any;
  graphSelectTableDataForDisplay: any;
  selectedName: string
  selectedSolutionName: string
  solutionListTableData;
  active = 1;
  inputDemoConfig: any;
  textareaDemoConfig: any;
  disabled: false;
  switchCount = 1;
  valueInOut: any;
  valueDataType: any;
  valueDeviceType: any;
  isChangeGraphName: boolean = false;

  projectDesc: string = "";
  projectName: string = "";
  path: string = "/home/modelbox_projects";
  model: string = "blank";
  optionSolutionList: any = ["blank"];

  folderList: any = [];

  solutionList: any = [];

  valuesProgramLanguage = [
    {
      name: 'Python',
      value: 'python'
    },
    {
      name: 'C++',
      value: 'c++'
    },
    {
      name: this.i18n.getById("inference"),
      value: 'inference'
    }];

  dataTableOptions = {
    columns: [
      {
        field: 'checked',
        header: '',
        fieldType: 'customized'
      },
      {
        field: 'name',
        header: this.i18n.getById("toolBar.select.name"),
        fieldType: 'text'
      },
      {
        field: 'dotSrc',
        header: this.i18n.getById("toolBar.select.dotSource"),
        fieldType: 'text'
      },
      {
        field: 'lastChanged',
        header: this.i18n.getById("toolBar.select.lastChanged"),
        fieldType: 'text'
      },
      {
        field: 'select_operation',
        header: this.i18n.getById("toolBar.select.operation"),
        fieldType: 'customized'
      }
    ]
  };

  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'checked',
      width: '50px'
    },
    {
      field: 'name',
      width: '100px'
    },
    {
      field: 'dotSrc',
      width: '300px'
    },
    {
      field: 'lastChanged',
      width: '150px'
    },
    {
      field: 'select_operation',
      width: '100px'
    },
  ];

  solutionTableOptions = {
    columns: [
      {
        field: 'checked',
        header: '',
        fieldType: 'customized'
      },
      {
        field: 'name',
        header: this.i18n.getById("toolBar.select.name"),
        fieldType: 'text'
      },
      {
        field: 'desc',
        header: this.i18n.getById("toolBar.setting.desc"),
        fieldType: 'text'
      },
      {
        field: 'file',
        header: this.i18n.getById("toolBar.solutionDialogFile"),
        fieldType: 'text'
      },
    ]
  };

  solutionTableWidthConfig: TableWidthConfig[] = [
    {
      field: 'checked',
      width: '5%'
    },
    {
      field: 'name',
      width: '20%'
    },
    {
      field: 'file',
      width: '40%'
    },
    {
      field: 'desc',
      width: '35%'
    },
  ];

  radioOptions = [{
    id: 1,
    label: this.i18n.getById('toolBar.setting.graphRankdir.topBottom')
  }, {
    id: 2,
    label: this.i18n.getById('toolBar.setting.graphRankdir.leftRight')
  }];

  formData = {
    graphName: '',
    graphDesc: '',
    radioValue: "N",
    skipDefault: false,
    flowunitPath: this.defaultDir,
    perfEnable: false,
    perfTraceEnable: false,
    perfSessionEnable: false,
    perfPath: this.defaultPerfDir
  };

  formDataCreateProject = {
    projectName: this.projectName,
    projectDesc: this.projectDesc,
    path: this.path,
  };

  formDataCreateFlowunit = {
    flowunitName: 'defaultFlowunit',
    desc: '',
    programLanguage: 'python',
    path: '/home/modelbox_projects/defaultProject/src/flowunit',
    deviceType: 'cpu',
    portInfos: [],
    flowunitType: 'NORMAL',
    flowunitVirtualType: 'tensorflow',
    title: 'Generic',
    modelEntry: '',
    plugin: ''
  };

  portInfo: any = {
    portType: '',
    dataType: '',
    deviceType: 'cpu',
    deviceNum: 0
  }

  optionsInOut = ['input', 'output'];
  optionsDataType = ['Number', 'String', 'Boolean', 'Array', 'Object']; //flowunit type
  optionsDeviceType = ['cpu', 'cuda'];
  flowunitGroupOptions = ['Image', 'Input', 'Output', 'Video', 'Generic']

  portHeaderOptions = {
    columns: [
      {
        field: 'inputOutput',
        header: this.i18n.getById("toolBar.modal.inputOutput"),
        fieldType: 'text'
      },
      {
        field: 'dataType',
        header: this.i18n.getById("toolBar.modal.dataType"),
        fieldType: 'text'
      },
      {
        field: 'deviceType',
        header: this.i18n.getById("toolBar.modal.deviceType"),
        fieldType: 'text'
      },
      {
        field: 'deviceNum',
        header: this.i18n.getById("toolBar.modal.deviceNum"),
        fieldType: 'text'
      },
      {
        field: 'operation',
        header: this.i18n.getById("toolBar.select.operation"),
        fieldType: 'customized'
      }
    ]
  };


  flowunitTypes = [
    {
      id: 'NORMAL',
      title: 'NORMAL'
    },
    {
      id: 'STREAM',
      title: 'STREAM'
    },
    {
      id: 'IF_ELSE',
      title: 'IF_ELSE'
    },
    {
      id: 'EXPAND',
      title: 'EXPAND'
    },
    {
      id: 'COLLAPSE',
      title: 'COLLAPSE'
    }
  ];

  flowunitVirtualTypes = [
    {
      id: 'tensorflow',
      title: 'Tensorflow'
    },
    {
      id: 'tensorrt',
      title: 'Tensorrt'
    },
    {
      id: 'torch',
      title: 'Torch'
    },
    {
      id: 'acl',
      title: 'Acl'
    },
    {
      id: 'mindspore',
      title: 'Mindspore'
    }
  ];

  tabActiveId: string = "tab1";
  openProjectPath: string = "/home/modelbox_projects";
  incomingGraphName: string = '';

  constructor(private dialogService: DialogService,
    private i18n: I18nService,
    private basicService: BasicServiceService,
    private domSanitizer: DomSanitizer,
    private dataService: DataServiceService,
    private toastService: ToastService) {
  }
  onToggle(event) {
    console.log(event);
  }

  ngOnInit() {
    const current_project = JSON.parse(localStorage.getItem('project'));
    if (current_project) {
      this.formData.graphName = current_project.graph.graphName;
      this.formData.graphDesc = current_project.graph.graphDesc;
      this.formData.flowunitPath = current_project.graph.dirs;
      this.formData.skipDefault = current_project.graph.skipDefault;
      this.formData.perfEnable = current_project.graph.settingPerfEnable;
      this.formData.perfTraceEnable = current_project.graph.settingPerfTraceEnable;
      this.formData.perfSessionEnable = current_project.graph.settingPerfSessionEnable;
      this.formData.perfPath = current_project.graph.settingPerfDir;

      this.formDataCreateProject.projectName = current_project.projectName;
      this.formDataCreateProject.projectDesc = current_project.projectDesc;
      this.formDataCreateProject.path = current_project.path;
    }

    this.loadGraphData();
    this.loadSolutionData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.formDataCreateProject) {
      this.formDataCreateFlowunit.path = this.formDataCreateProject.path +
        "/" +
        this.formDataCreateProject.projectName +
        "/src/flowunit";

      this.portInfo.deviceType = this.formDataCreateFlowunit.deviceType;

      if (this.formDataCreateProject.projectName && typeof (this.formData.flowunitPath) === "string" &&
        this.formData.flowunitPath.indexOf(this.formDataCreateFlowunit.path) < 0) {
        this.formData.flowunitPath += "\n" + this.formDataCreateFlowunit.path;
      }
    }
  }

  loadGraphData() {
    this.graphSelectTableData = Object.keys(this.graphs).map(item => {
      return {
        name: item,
        dotSrc: this.graphs[item].graph.dotSrc,
        lastChanged: new Date(this.graphs[item].graph.dotSrcLastChangeTime),
        svgString: this.graphs[item].graph.svgString,
        checked: false
      };
    });
    this.graphSelectTableDataForDisplay = JSON.parse(JSON.stringify(this.graphSelectTableData));
    for (let e in this.graphSelectTableDataForDisplay) {
      this.graphSelectTableDataForDisplay[e].dotSrc = this.transformDisplayData(this.graphSelectTableDataForDisplay[e].dotSrc);
    }
  }

  getFormDataCreateProject() {
    return this.formDataCreateProject;
  }

  programLanguageValueChange2(value) {
    this.formDataCreateFlowunit.programLanguage = value;
  }

  transformDisplayData(data) {
    if (data) {
      if (data.length > 100) {
        data = data.substr(0, 61) + "...";
      }
    }
    return data;
  }

  onRowCheckChange(checked, rowIndex, nestedIndex, rowItem) {
    const self = this;
    rowItem.checked = checked;
    this.selectedName = rowItem.name;
    this.graphSelectTableData = [];
    this.graphSelectTableDataForDisplay.map(function (obj) {
      if (obj != rowItem) {
        obj.checked = false;
      }
      self.graphSelectTableData.push(obj);
      return obj;
    })
  }

  onSolutionRowCheckChange(checked, rowItem) {
    rowItem.checked = checked;
    this.selectedSolutionName = rowItem.name;
    this.solutionList.map(function (obj) {
      if (obj != rowItem) {
        obj.checked = false;
      }
      return obj;
    })
  }

  loadSolutionData() {
    this.basicService.querySolutionList().subscribe(
      (data: any) => {
        data.solution_list.forEach((item) => {
          let obj = { name: '', desc: '', file: '', checked: false };
          obj.name = item.name;
          obj.desc = item.desc;
          obj.file = item.file;
          this.solutionList.push(obj)
        });
        this.optionSolutionList = this.optionSolutionList.concat(this.solutionList.map(function (obj) {
          return obj.name;
        }));
      },
      (error) => {
        return null;
      })
  }

  handleAddPortInfoClick(): void {
    if (this.portInfo != null) {
      this.formDataCreateFlowunit.portInfos.push({ ...this.portInfo });
    }
  }

  deletePort(row, rowIndex) {
    this.formDataCreateFlowunit.portInfos.splice(rowIndex, 1);
  }

  deleteData(row, rowIndex) {
    delete this.graphs[row.name];
    this.graphSelectTableData = this.graphSelectTableData.filter(item => {
      return item.name != row.name;
    })
    this.graphSelectTableDataForDisplay = JSON.parse(JSON.stringify(this.graphSelectTableData));
    for (let e in this.graphSelectTableDataForDisplay) {
      this.graphSelectTableDataForDisplay[e].dotSrc = this.transformDisplayData(this.graphSelectTableDataForDisplay[e].dotSrc);
    }
    this.graphsEmmiter.emit(this.graphs);
  }

  onCheckboxSkipDefaultChange(value) {
    this.formData.skipDefault = value;
  }

  onCheckboxPerfEnableChange(value) {
    this.formData.perfEnable = value;
  }

  onCheckboxPerfTraceEnableChange(value) {
    this.formData.perfTraceEnable = value;
  }

  onCheckboxPerfSessionEnableChange(value) {
    this.formData.perfSessionEnable = value;
  }

  initFormData() {
    this.formData = {
      graphName: '',
      graphDesc: '',
      radioValue: "N",
      skipDefault: false,
      flowunitPath: this.defaultDir,
      perfEnable: false,
      perfTraceEnable: false,
      perfSessionEnable: false,
      perfPath: this.defaultPerfDir
    };
  }

  click(tab: string): void {
    if (tab === 'basic') {
      this.activeBasic = true;
      this.activePerf = false;
    } else {
      this.activeBasic = false;
      this.activePerf = true;
    }
  }

  saveAllProject() {
    debugger
    this.showSaveAsDialog();
  }

  handleUndoButtonClick = event => {
    this.onUndoButtonClick(event.currentTarget);
  };

  handleRedoButtonClick = event => {
    this.onRedoButtonClick(event.currentTarget);
  };

  handleZoomInButtonClick = event => {
    this.onZoomInButtonClick && this.onZoomInButtonClick();
  };

  handleZoomOutButtonClick = event => {
    this.onZoomOutButtonClick && this.onZoomOutButtonClick();
  };

  handleZoomFitButtonClick = event => {
    this.onZoomFitButtonClick && this.onZoomFitButtonClick();
  };

  handleZoomResetButtonClick = event => {
    this.onZoomResetButtonClick && this.onZoomResetButtonClick();
  };

  handleConfirmNameChange = (event, src, rename) => {
    this.onConfirmNameChange && this.onConfirmNameChange(event, src, rename);
  };

  handleNewButtonClick = event => {
    this.onNewButtonClick && this.onNewButtonClick();
  };

  handleSwitchDirectionButtonClick = event => {
    this.onSwitchDirectionButtonClick && this.onSwitchDirectionButtonClick();
  };

  handleRunButtonClick = event => {
    this.onRunButtonClick && this.onRunButtonClick();
  };

  handleCreateProjectButtonClick = event => {
    this.onCreateProjectButtonClick && this.onCreateProjectButtonClick();
  };

  initFormDataCreateFlowunit() {
    this.formDataCreateFlowunit = {
      flowunitName: 'defaultFlowunit',
      desc: '',
      programLanguage: 'python',
      path: '/home/modelbox_projects/defaultProject/src/flowunit',
      portInfos: [],
      deviceType: 'cpu',
      flowunitType: 'NORMAL',
      flowunitVirtualType: 'tensorflow',
      title: 'Generic',
      modelEntry: '',
      plugin: ''
    };
  }


  createFlowunit() {
    let param;
    if (this.formDataCreateFlowunit.programLanguage !== "inference") {
      delete this.formDataCreateFlowunit.flowunitVirtualType;
      delete this.formDataCreateFlowunit.plugin;
      delete this.formDataCreateFlowunit.modelEntry;
    } else {
      this.formDataCreateFlowunit.programLanguage = "infer"
    }
    param = this.formDataCreateFlowunit;
    this.basicService.createFlowunit(param).subscribe(
      (data: any) => {
        if (data) {
          if (data.status == 201) {
            //clear info
            this.initFormDataCreateFlowunit();
            //flowunit列表更新
            //this.dataService.nodeShapeCategoriesAdd(param);
            let dirs;
            if (typeof (this.formData.flowunitPath) === "string") {
              dirs = this.formData.flowunitPath.replace(/\s\s*$/gm, "").split("\n");
            } else {
              dirs = [];
            }
            this.dataService.loadFlowUnit("", dirs);
          }
        }
      },
      (error) => {
        return null;
      });
  }

  cellDBClick(e) {
    if (e.rowIndex !== 0) {
      this.openProjectPath = this.openProjectPath + "/" + e.rowItem.folder;
      this.searchDirectory();
    } else {
      this.cellClick(e);
    }
  }
  cellClick(e) {
    if (e.rowIndex === 0) {
      let position = this.openProjectPath.lastIndexOf("/");
      this.openProjectPath = this.openProjectPath.substring(0, position);
      this.searchDirectory();
    }
  }

  searchDirectory() {
    this.basicService.loadTreeByPath(this.openProjectPath).subscribe(
      (data: any) => {
        if (data.folder_list) {
          this.folderList = [{ "folder": this.i18n.getById('toolBar.modal.return') }];

          let temp = data.folder_list.filter(dir => dir != "." && dir != "..");

          temp.forEach(element => {
            this.folderList.push({ "folder": element });
          });
        }
      },
      error => {
        if (error) {
          if (error.staus == 404) {
            this.toastService.open({
              value: [{ severity: 'warn', content: this.i18n.getById('message.noFolder') }],
              life: 1500
            });
          }
        }
        this.folderList = [];
        return;
      });
  }

  openProject() {
    if (this.folderList.indexOf("src")) {
      debugger
      this.basicService.openProject(this.openProjectPath).subscribe(
        (data: any) => {
          if (data) {
            debugger
            //加载项目信息
            //加载功能单元信息
            //加载图信息
          }
        },
        (error) => {
          return;
        });
    }
  }

  toggleTip(tooltip, context: any) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ context });
    }
  }

  refreshFlowunit(){
    this.refreshEmmiter.emit("refresh");
  }

  showSaveAsDialog() {
    const results = this.dialogService.open({
      id: 'save-as-ok',
      width: '400px',
      showAnimation: true,
      title: this.i18n.getById('toolBar.saveAsButton'),
      content: ModalSaveAsComponent,
      backdropCloseable: true,
      dialogtype: 'standard',
      data: {
        'graphName': this.oldName
      },
      buttons: [{
        cssClass: 'danger',
        text: this.i18n.getById('modal.okButton'),
        disabled: false,
        handler: ($event: Event) => {
          results.modalInstance.hide();
          results.modalInstance.zIndex = -1;
          this.formData.graphName = results.modalContentInstance.graphName;
          this.handleConfirmNameChange(results.modalContentInstance.graphName, '', false);
          this.loadGraphData();
          this.basicService.saveAllProject();
        },
      },
      {
        id: 'save-as-cancel',
        cssClass: 'common',
        text: this.i18n.getById('modal.cancelButton'),
        handler: ($event: Event) => {
          results.modalInstance.hide();
          results.modalInstance.zIndex = -1;
        },
      },],
    });

  }
}
