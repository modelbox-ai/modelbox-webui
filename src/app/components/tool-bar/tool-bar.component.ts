import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { I18nService } from '@core/i18n.service';
import { DialogService } from 'ng-devui/modal';
import { ModalSaveAsComponent } from '../modal-save-as/modal-save-as.component';
import { FormLayout } from 'ng-devui/form';
import { DataTableComponent, TableWidthConfig } from 'ng-devui/data-table';
import { TabsModule } from 'ng-devui/tabs';

declare const require: any
@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.less'],
})

export class ToolBarComponent {
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  @Input() hasUndo: boolean;
  @Input() hasRedo: boolean;
  @Input() projects: any = {};
  @Input() onUndoButtonClick: any;
  @Input() onRedoButtonClick: any;
  @Input() onZoomInButtonClick: any;
  @Input() onZoomOutButtonClick: any;
  @Input() onZoomResetButtonClick: any;
  @Input() onZoomFitButtonClick: any;
  @Input() onConfirmNameChange: any;
  @Input() onNewButtonClick: any;
  @Input() oldName: string;
  @Input() showGraphSettingDialog: any;
  @Input() showSelectDialog: any;
  @Input() showSolutionDialog: any;
  @Input() solutionList: any;

  @Output() projectsEmmiter = new EventEmitter()

  backSvg = require("../../../assets/undo.svg");
  redoSvg = require("../../../assets/redo.svg");
  zoomInSvg = require("../../../assets/zoom-in.svg");
  zoomOutSvg = require("../../../assets/zoom-out.svg");
  zoomResetSvg = require("../../../assets/zoom-reset.svg");
  zoomFitSvg = require("../../../assets/zoom-out-map.svg");
  defaultPerfDir: string = '/tmp/modelbox/perf/';
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
    name: '',
    desc: '',
    radioValue: 1,
    skipDefault: false,
    flowunitPath: '',
    perfEnable: false,
    perfTraceEnable: false,
    perfSessionEnable: false,
    perfPath: this.defaultPerfDir
  };

  constructor(private dialogService: DialogService, private i18n: I18nService,) {
  }

  ngOnInit() {

    const current_project = JSON.parse(localStorage.getItem('project'));
    if (current_project) {
      this.formData.name = this.oldName;
      this.formData.desc = current_project.desc;
      let randdirRegex = /[\n|{]\s*rankdir\s*=\s*([a-zA-Z]*).*\s*[\n|}]/g;
      let match = randdirRegex.exec(current_project.dotSrc);
      let rankdir = 1;
      if (match != null && match.length > 0 && match[1] === "LR") {
        rankdir = 2;
      }

      this.formData.radioValue = rankdir;
      this.formData.flowunitPath = current_project.dirs;
      this.formData.skipDefault = current_project.skipDefault;
      this.formData.perfEnable = current_project.settingPerfEnable;
      this.formData.perfTraceEnable = current_project.settingPerfTraceEnable;
      this.formData.perfSessionEnable = current_project.settingPerfSessionEnable;
      this.formData.perfPath = current_project.settingPerfDir;
    }

    this.graphSelectTableData = Object.keys(this.projects).map(item => {
      return {
        name: item,
        dotSrc: this.projects[item].dotSrc,
        lastChanged: new Date(this.projects[item].dotSrcLastChangeTime),
        svgString: this.projects[item].svgString,
        checked: false
      };
    });

    this.graphSelectTableDataForDisplay = JSON.parse(JSON.stringify(this.graphSelectTableData));
    for (let e in this.graphSelectTableDataForDisplay) {
      this.graphSelectTableDataForDisplay[e].dotSrc = this.transformDisplayData(this.graphSelectTableDataForDisplay[e].dotSrc);
    }

    this.solutionList.map(function (obj) {
      obj.checked = false;
      return obj;
    })
  }

  transformDisplayData(data) {
    if (data.length > 100) {
      data = data.substr(0, 61) + "...";
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

  onSolutionRowCheckChange(checked, rowIndex, nestedIndex, rowItem) {
    rowItem.checked = checked;
    this.selectedSolutionName = rowItem.name;
    this.solutionList.map(function (obj) {
      if (obj != rowItem) {
        obj.checked = false;
      }
      return obj;
    })
  }

  deleteData(row, rowIndex) {
    delete this.projects[row.name];
    this.graphSelectTableData = this.graphSelectTableData.filter(item => {
      return item.name != row.name;
    })
    this.graphSelectTableDataForDisplay = JSON.parse(JSON.stringify(this.graphSelectTableData));
    this.projectsEmmiter.emit(this.projects);
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

  click(tab: string): void {
    if (tab === 'basic') {
      this.activeBasic = true;
      this.activePerf = false;
    } else {
      this.activeBasic = false;
      this.activePerf = true;
    }
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
          this.formData.name = results.modalContentInstance.graphName;
          this.handleConfirmNameChange(results.modalContentInstance.graphName, '', false);
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
