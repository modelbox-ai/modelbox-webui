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
import { treeDataSource } from '../management/mock-data';

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
  @Output() dotSrcEmmiter = new EventEmitter();
  @Output() createProjectEmmiter = new EventEmitter();
  @Output() flowunitEmmiter = new EventEmitter();
  @Output() projectPathEmmiter = new EventEmitter();
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

  openProjectList = [];

  activeBasic: boolean = true;
  activePerf: boolean = false;
  portdeviceAble = false;
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
  valuedata_type: any;
  valuedevice: any;
  isChangeGraphName: boolean = false;
  isCopy = true;
  project_desc: string = "";
  project_name: string = "";
  path: string = this.dataService.defaultSearchPath;
  template: string = "empty";
  optionSolutionList: any = [];
  blank: any = {
    checked: false,
    desc: "",
    file: "",
    name: "blank"
  };


  folderList: any = [];

  solutionList: any = [];

  valueslang = [
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
    },
    {
      name: 'Yolo',
      value: 'yolo'
    }
  ];

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

  valuesCheckbox = [];

  formData = {
    graphName: '',
    graphDesc: '',
    radioValue: "N",
    skipDefault: false,
    flowunitPath: this.dataService.commonFlowunitPath,
    perfEnable: false,
    perfTraceEnable: false,
    perfSessionEnable: false,
    perfPath: this.dataService.defaultPerfDir
  };
  flowunitDebugPath: any;
  flowunitReleasePath: any;

  formDataCreateProject = {
    name: this.project_name,
    rootpath: this.path,
    template: this.template
  };

  formDataCreateFlowunit = {
    name: 'flowunit',
    desc: '',
    lang: 'python',
    "project-path": this.formDataCreateProject.rootpath,
    device: 'cpu',
    port_infos: [],
    type: 'normal',
    "virtual-type": 'tensorflow',
    "group-type": 'generic',
    model: '',
    plugin: ''
  };

  portInfo: any = {
    port_name: '',
    port_type: '',
    data_type: '',
    device: 'cpu',
  }

  optionsInOut = ['input', 'output'];
  optionsdata_type = ['int', 'float']; //flowunit type
  optionsdevice = ['cpu', 'cuda'];
  flowunitGroupOptions = ['generic', 'video', 'inference']

  portHeaderOptions = {
    columns: [
      {
        field: 'inputOutput',
        header: this.i18n.getById("toolBar.modal.inputOutput"),
        fieldType: 'text'
      },
      {
        field: 'portName',
        header: this.i18n.getById("toolBar.modal.port_name"),
        fieldType: 'text'
      },
      {
        field: 'device',
        header: this.i18n.getById("toolBar.modal.device"),
        fieldType: 'text'
      },
      {
        field: 'operation',
        header: this.i18n.getById("toolBar.select.operation"),
        fieldType: 'customized'
      }
    ]
  };

  defaultPortHeaderOptions = {
    columns: [
      {
        field: 'inputOutput',
        header: this.i18n.getById("toolBar.modal.inputOutput"),
        fieldType: 'text'
      },
      {
        field: 'portName',
        header: this.i18n.getById("toolBar.modal.port_name"),
        fieldType: 'text'
      },
      {
        field: 'device',
        header: this.i18n.getById("toolBar.modal.device"),
        fieldType: 'text'
      },
      {
        field: 'operation',
        header: this.i18n.getById("toolBar.select.operation"),
        fieldType: 'customized'
      }
    ]
  };

  portHeaderFullOptions = {
    columns: [
      {
        field: 'inputOutput',
        header: this.i18n.getById("toolBar.modal.inputOutput"),
        fieldType: 'text'
      },
      {
        field: 'portName',
        header: this.i18n.getById("toolBar.modal.port_name"),
        fieldType: 'text'
      },
      {
        field: 'data_type',
        header: this.i18n.getById("toolBar.modal.data_type"),
        fieldType: 'text'
      },
      {
        field: 'device',
        header: this.i18n.getById("toolBar.modal.device"),
        fieldType: 'text'
      },
      {
        field: 'operation',
        header: this.i18n.getById("toolBar.select.operation"),
        fieldType: 'customized'
      }
    ]
  };


  flowunit_types = [
    {
      id: 'normal',
      title: 'NORMAL'
    },
    {
      id: 'stream',
      title: 'STREAM'
    },
    {
      id: 'condition',
      title: 'IF_ELSE'
    },
    {
      id: 'expand',
      title: 'EXPAND'
    },
    {
      id: 'collapse',
      title: 'COLLAPSE'
    }
  ];

  types = [
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

  types_yolo = [
    {
      id: 'yolov3_postprocess',
      title: 'yolov3_postprocess'
    },
    {
      id: 'yolov5_postprocess',
      title: 'yolov5_postprocess'
    },
  ];

  in_num = 1;
  out_num = 2;
  isOpen = false;

  tabActiveId: string = "tab1";
  openproject_path: string = this.dataService.defaultSearchPath;
  openProjectListPath: string = "/home";
  incomingGraphName: string = '';
  isChangingPortName: boolean;

  constructor(private dialogService: DialogService,
    private i18n: I18nService,
    private basicService: BasicServiceService,
    private domSanitizer: DomSanitizer,
    private dataService: DataServiceService,
    private toastService: ToastService) {
  }

  ngOnInit() {
    const current_project = JSON.parse(localStorage.getItem('project'));
    if (current_project) {
      this.formData.graphName = current_project.graph.graphName;
      this.formData.graphDesc = current_project.graph.graphDesc;
      this.formData.flowunitPath = current_project.graph.dirs;
      this.flowunitDebugPath = current_project.graph.dirs;
      this.formData.skipDefault = current_project.graph.skipDefault;
      this.formData.perfEnable = current_project.graph.settingPerfEnable;
      this.formData.perfTraceEnable = current_project.graph.settingPerfTraceEnable;
      this.formData.perfSessionEnable = current_project.graph.settingPerfSessionEnable;
      this.formData.perfPath = current_project.graph.settingPerfDir;

      this.formDataCreateProject.name = current_project.name;
      this.formDataCreateProject.rootpath = current_project.rootpath;
      this.formDataCreateFlowunit["project-path"] = this.formDataCreateProject.rootpath + "/" + this.formDataCreateProject.name;
      this.projectPathEmmiter.emit(this.formDataCreateFlowunit["project-path"]);

      this.flowunitReleasePath = "/opt/modelbox/application/" + this.formDataCreateProject.name;
    }

    this.loadGraphData();
    this.loadSolutionData();
    if (this.formDataCreateProject.name) {
      this.searchDirectory();
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.formDataCreateProject) {
      this.formDataCreateFlowunit["project-path"] = this.formDataCreateProject.rootpath + "/" + this.formDataCreateProject.name;
      this.projectPathEmmiter.emit(this.formDataCreateFlowunit["project-path"]);
      this.flowunitReleasePath = "/opt/modelbox/application/" + this.formDataCreateProject.name;
    }
    let projectListPath = this.openproject_path.substring(0, this.openproject_path.lastIndexOf("/"));
    if (projectListPath !== this.openProjectListPath) {
      this.openProjectListPath = projectListPath;
      this.loadOpenProjectList();
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

  langValueChange2(value) {
    this.formDataCreateFlowunit.lang = value;
    if (value === "inference") {
      this.formDataCreateFlowunit.device = 'cuda';
      this.portInfo.device = 'cuda';

    }
    if (this.formDataCreateFlowunit.lang === "inference") {
      this.portHeaderOptions = this.portHeaderFullOptions;
    } else {
      this.portHeaderOptions = this.defaultPortHeaderOptions;
    }
    if (value === "yolo") {
      this.formDataCreateFlowunit['virtual-type'] = this.types_yolo[0].id;
    }

    this.formDataCreateFlowunit.port_infos = [];

  }

  deviceValueChange(value) {
    this.formDataCreateFlowunit.device = value;
    this.portInfo.device = value;
  }

  controlToggle(e) {
    if (this.isOpen === true) {
      this.isOpen = false;
    } else {
      if (e.currentTarget.innerText === this.i18n.getById("toolBar.flowunit")) {
        this.isOpen = true;
      }
    }
  }

  handleValueChangeport_type(e) {
    if (e === "output") {
      this.portdeviceAble = true;
      this.portInfo.port_name = "output" + this.out_num;
    } else {
      this.portdeviceAble = false;
      this.portInfo.port_name = "input" + this.in_num;
    }
    this.portInfo.device = this.formDataCreateFlowunit.device;

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
    this.basicService.queryTemplate().subscribe(
      (data: any) => {
        data.project_template_list.forEach((item) => {
          let obj = { name: '', desc: '', dirname: '' };
          obj.name = item.name;
          obj.desc = item.desc;
          obj.dirname = item.dirname;
          this.optionSolutionList.push(obj)
        });
        let tmp = [];
        for (var i = 0, len = this.optionSolutionList.length; i < len; i += 2) {
          tmp.push(this.optionSolutionList.slice(i, i + 2));
        }
        this.optionSolutionList = tmp;
      },
      (error) => {
        return null;
      })
  }

  onPortNameChange(e) {
    this.isChangingPortName = true;
  }

  handleAddPortInfoClick(): void {
    if (this.portInfo != null) {
      if (["python", "c++", "yolo"].indexOf(this.formDataCreateFlowunit.lang) > -1) {
        delete this.portInfo.data_type
      }
      if (!this.formDataCreateFlowunit.port_infos) {
        this.formDataCreateFlowunit.port_infos = [];
      }
      for (let key in this.portInfo) {
        if (!this.portInfo[key]) {
          this.toastService.open({
            value: [{ severity: 'warn', content: key + this.i18n.getById("message.valueIsNecessary") }],
            life: 2000,
            style: { top: '100px' }
          });
          return;
        }

        if (this.formDataCreateFlowunit.lang === "inference" && !this.portInfo.data_type) {
          this.toastService.open({
            value: [{ severity: 'warn', content: this.i18n.getById("message.valueIsNecessaryForDataType") }],
            life: 2000,
            style: { top: '100px' }
          });
          return;
        }
      }

      if (this.portInfo.port_type === "input" && this.isChangingPortName == false) {
        this.in_num += 1;
        this.portInfo.port_name = "input" + this.in_num;
      } else if (this.portInfo.port_type === "output" && this.isChangingPortName == false) {
        this.out_num += 1;
        this.portInfo.port_name = "output" + this.out_num;
      }
      this.formDataCreateFlowunit.port_infos.push({ ...this.portInfo });
    }
    this.isChangingPortName = false;
  }

  checkFormDataCreateFlowunit() {
    if (!this.formDataCreateFlowunit.name) {
      this.toastService.open({
        value: [{ severity: 'warn', content: this.i18n.getById("message.nameOfFlowunitIsNecessary") }],
        life: 2000,
        style: { top: '100px' }
      });
      return false;
    } else if (!this.formDataCreateFlowunit.lang) {
      this.toastService.open({
        value: [{ severity: 'warn', content: this.i18n.getById("message.langOfFlowunitIsNecessary") }],
        life: 2000,
        style: { top: '100px' }
      });
      return false;
    } else if (!this.formDataCreateFlowunit.device) {
      this.toastService.open({
        value: [{ severity: 'warn', content: this.i18n.getById("message.deviceTypeOfFlowunitIsNecessary") }],
        life: 2000,
        style: { top: '100px' }
      });
      return false;
    } else if (!this.formDataCreateFlowunit.type && !this.formDataCreateFlowunit["virtual-type"]) {
      this.toastService.open({
        value: [{ severity: 'warn', content: this.i18n.getById("message.typeOfFlowunitIsNecessary") }],
        life: 2000,
        style: { top: '100px' }
      });
      return false;
    } else if (!this.formDataCreateFlowunit["group-type"]) {
      this.toastService.open({
        value: [{ severity: 'warn', content: this.i18n.getById("message.groupOfFlowunitIsNecessary") }],
        life: 2000,
        style: { top: '100px' }
      });
      return false;
    } else if (this.formDataCreateFlowunit.port_infos && this.formDataCreateFlowunit.port_infos.length === 0) {
      this.toastService.open({
        value: [{ severity: 'warn', content: this.i18n.getById("message.atLeastOneInputOrOutput") }],
        life: 2000,
        style: { top: '100px' }
      });
      return false;
    }
    return true;
  }

  deletePort(row, rowIndex) {
    this.formDataCreateFlowunit.port_infos.splice(rowIndex, 1);
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
      flowunitPath: this.dataService.commonFlowunitPath,
      perfEnable: false,
      perfTraceEnable: false,
      perfSessionEnable: false,
      perfPath: this.dataService.defaultPerfDir
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
    this.onRunButtonClick && this.onRunButtonClick(this.formData.graphName);
  };

  handleCreateProjectButtonClick = event => {
    this.onCreateProjectButtonClick && this.onCreateProjectButtonClick();
  };

  initFormDataCreateFlowunit() {
    this.formDataCreateFlowunit = {
      name: 'flowunit',
      desc: '',
      lang: 'python',
      "project-path": this.dataService.defaultSearchPath + this.project_name + '/src/flowunit',
      port_infos: [],
      device: 'cpu',
      type: 'normal',
      "virtual-type": 'tensorflow',
      "group-type": 'generic',
      model: '',
      plugin: ''
    };
    this.in_num = 1;
    this.out_num = 1;
  }


  createFlowunit(comp) {
    if (!this.checkFormDataCreateFlowunit()) {
      return false;
    }
    let param;
    if (this.isCopy === true) {
      this.formDataCreateFlowunit["copy-model"] = null;
    } else {
      delete this.formDataCreateFlowunit["copy-model"];
    }
    if (this.formDataCreateFlowunit.lang !== "inference") {
      delete this.formDataCreateFlowunit.plugin;
      delete this.formDataCreateFlowunit.model;
      delete this.formDataCreateFlowunit["copy-model"];
      if (this.formDataCreateFlowunit.lang !== "yolo") {
        delete this.formDataCreateFlowunit["virtual-type"];
        delete this.formDataCreateFlowunit["copy-model"];
      }
    } else {
      this.formDataCreateFlowunit.lang = "infer";
      this.formDataCreateFlowunit["group-type"] = "inference";
    }

    if (this.formDataCreateFlowunit.type === "normal") {
      delete this.formDataCreateFlowunit.type;
    }
    param = this.formDataCreateFlowunit;
    let ret = this.infoCreateProjectFirst();
    if (!ret) {
      return;
    }
    let input = [];
    let output = [];



    this.formDataCreateFlowunit.port_infos.forEach(ele => {

      if (ele.port_type === "input") {
        input.push({
          name: ele.port_name,
          device: ele.device,
          type: ele.data_type
        })
      } else if (ele.port_type === "output") {
        output.push({
          name: ele.port_name,
          type: ele.data_type
        })
      }
    });
    input.map(ele => {
      if (!ele.device) {
        delete ele.device;
      }
      if (!ele.type) {
        delete ele.type;
      }
    });
    output.map(ele => {
      if (!ele.type) {
        delete ele.type;
      }
    });

    delete param.port_infos;
    if (input.length > 0) {
      param.input = input;
    }
    if (output.length > 0) {
      param.output = output;
    }
    this.initFormDataCreateFlowunit();

    this.basicService.createFlowunit(param).subscribe(
      (data: any) => {
        if (data) {
          if (data.status == 201) {
            //clear info
            this.initFormDataCreateFlowunit();
            //flowunit列表更新
            let dirs;
            let type = typeof (this.formData.flowunitPath);
            if (type === "string") {
              dirs = this.formData.flowunitPath.replace(/\s\s*$/gm, "").split("\n");
            } else {
              dirs = [];
            }
            dirs.push(param["project-path"] + "/src/flowunit/");
            this.formData.flowunitPath = dirs.join("\n");
            this.flowunitEmmiter.emit(this.formData.flowunitPath);
            this.dataService.loadFlowUnit("", dirs, this.formDataCreateProject.rootpath + "/" + this.formDataCreateProject.name);
            this.initFormDataCreateFlowunit();
            this.refreshFlowunit();
            this.toastService.open({
              value: [{ severity: 'success', content: data.body.msg }],
              life: 1500,
              style: { top: '100px' }
            });

            comp.modalInstance.hide();
            comp.modalInstance.zIndex = -1;
          }
        }
      },
      (error) => {
        this.toastService.open({
          value: [{ severity: 'error', summary: 'ERROR', content: error.error.msg }],
          life: 150000,
          style: { top: '100px' }
        });
        return null;
      });
    return true;
  }

  cellClick(e) {
    if (e.rowIndex === 0) {
      let position = this.openproject_path.lastIndexOf("/");
      this.openproject_path = this.openproject_path.substring(0, position);
      this.searchDirectory();
    } else {
      this.openproject_path = this.openproject_path + "/" + e.rowItem.folder;
      this.searchDirectory();
    }
  }

  onCheckbox2Change(e) {
    if (e.isChecked) {
      this.valuesCheckbox = [e.value];
    } else {
      this.valuesCheckbox = [];
    }

  }

  onClickCard(e) {
    this.formDataCreateProject.template = e.dirname;
    this.createProjectEmmiter.emit(this.formDataCreateProject);
  }

  searchDirectory() {
    this.basicService.loadTreeByPath(this.openproject_path).subscribe(
      (data: any) => {
        if (data.subdir) {
          this.folderList = [{ "folder": this.i18n.getById('toolBar.modal.return'), "isProject": "是否modelbox项目" }];
          data.subdir.forEach(element => {
            if (element.isproject) {
              this.folderList.push({ "folder": element.dirname, "isProject": "✓" });
            } else {
              this.folderList.push({ "folder": element.dirname });
            }
          });
        }
      },
      error => {
        if (error) {
          if (error.staus == 404) {
            this.toastService.open({
              value: [{ severity: 'warn', content: this.i18n.getById('message.noFolder') }],
              life: 2000,
              style: { top: '100px' }
            });
          } else {
            this.toastService.open({
              value: [{ severity: 'error', summary: 'ERROR', content: error.error.msg }],
              life: 150000,
              style: { top: '100px' }
            });
          }
        }
        this.folderList = [];
        return;
      });
  }

  onPathSelect(e) {
    this.openproject_path = e;
    this.searchDirectory();
  }

  loadOpenProjectList() {
    this.basicService.loadTreeByPath(this.openProjectListPath).subscribe(
      (data: any) => {
        if (data.folder_list) {
          this.openProjectList = [];

          let temp = data.folder_list.filter(dir => dir != "." && dir != "..");

          temp.forEach(element => {
            this.openProjectList.push(this.openProjectListPath + "/" + element);
          });
        }
      },
      error => {
        this.openProjectList = [];
        return;
      });
  }

  openProject(comp) {
    if (this.folderList.indexOf("src")) {
      this.basicService.openProject(this.openproject_path).subscribe(
        (data: any) => {
          if (data) {
            //加载项目信息
            this.formDataCreateProject.name = data.project_name;
            this.formDataCreateProject.rootpath = data.project_path.substring(0, data.project_path.lastIndexOf("/"));

            //加载功能单元信息
            //加载图信息
            if (data.graphs && data.graphs[0] != null) {
              if (data.graphs[0].graph.graphconf) {
                this.formData.graphName = data.graphs[0].name;
                this.formData.skipDefault = false;
                if (data.graphs[0].profile) {
                  this.formData.perfEnable = data.graphs[0].profile.profile;

                  this.formData.perfTraceEnable = data.graphs[0].profile.trace;
                }
                this.dotSrcEmmiter.emit(data.graphs[0].graph.graphconf);
                this.formData.flowunitPath = data.graphs[0].driver.dir;
                this.flowunitEmmiter.emit(this.formData.flowunitPath);
                this.project_name = data.project_name;
              } else {
                this.initFormData();
                this.dotSrcEmmiter.emit(this.dataService.defaultSrc);
              }
            } else {
              this.initFormData();
              this.dotSrcEmmiter.emit(this.dataService.defaultSrc);
            }

            comp.modalInstance.hide();
            comp.modalInstance.zIndex = -1;
          }
        },
        (error) => {
          this.toastService.open({
            value: [{ severity: 'error', summary: 'ERROR', content: error.error.msg }],
            life: 150000,
            style: { top: '100px' }
          });
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

  refreshFlowunit() {
    this.refreshEmmiter.emit("refresh");
  }

  showSaveAsDialog() {
    this.loadGraphData();
    let param = JSON.parse(localStorage.getItem('project'));
    let ret = this.infoCreateProjectFirst();
    if (!ret) {
      return;
    }
    param = this.createProjectParam(param);
    this.basicService.saveAllProject(param).subscribe((data) => {
      if (data.status === 201) {
        this.toastService.open({
          value: [{ severity: 'success', content: this.i18n.getById("message.createProjectSuccess") }],
          life: 1500,
          style: { top: '100px' }
        });
      }
    },
      (error) => {
        this.toastService.open({
          value: [{ severity: 'error', summary: 'ERROR', content: error.error.msg }],
          life: 150000,
          style: { top: '100px' }
        });
        return null;
      });
  }

  getGraphNameFromGraph(graph) {
    let graphName = "";
    var n = graph.match(/(?<=digraph ).*?(?= {)/gm);
    if (n) {
      graphName = n[0];
    }
    return graphName;
  }

  createProjectParam(project) {
    let params = {};
    params = {
      job_id: this.getGraphNameFromGraph(project.graph.dotSrc),
      graph_name: "",
      job_graph: {},
      graph: {
        flow: {
          desc: project.graph.graphDesc,
        },
        driver: {
          "skip-default": project.graph.skipDefault,
          dir: project.graph.dirs,
        },
        profile: {
          profile: project.graph.settingPerfEnable,
          trace: project.graph.settingPerfTraceEnable,
          session: project.graph.settingPerfSessionEnable,
          dir: project.graph.settingPerfDir,
        },
        graph: {
          graphconf: project.graph.dotSrc,
          format: "graphviz",
        },
      },
      graph_path: project.rootpath + "/" + project.name
    }
    params["graph_name"] = params["job_id"];
    params["job_graph"] = params["graph"];
    return params;
  }

  infoCreateProjectFirst() {
    if (!this.formDataCreateProject.name) {
      this.toastService.open({
        value: [{ severity: 'warn', content: this.i18n.getById("message.createProjectFirst") }],
        life: 3000,
        style: { top: '100px' }
      });
      return false;
    } else {
      return true;
    }
  }
}


