import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { I18nService } from '@core/i18n.service';
import { BasicServiceService } from '@shared/services/basic-service.service';
import { DataServiceService } from '@shared/services/data-service.service';
import { ToastService } from 'ng-devui/toast';
import { DialogService, ModalService } from 'ng-devui/modal';

declare const require: any
@Component({
  selector: 'app-tool-bar-solution',
  templateUrl: './tool-bar-solution.component.html',
  styleUrls: ['./tool-bar-solution.component.less']
})
export class ToolBarSolutionComponent implements OnInit {

  @ViewChild('selectDemo') selectDemo: TemplateRef<any>;

  @Input() hasUndo: boolean;
  @Input() hasRedo: boolean;
  @Input() onUndoButtonClick: any;
  @Input() onRedoButtonClick: any;
  @Input() onZoomInButtonClick: any;
  @Input() onZoomOutButtonClick: any;
  @Input() onZoomResetButtonClick: any;
  @Input() onZoomFitButtonClick: any;
  @Input() onConfirmNameChange: any;
  @Input() onNewButtonClick: any;
  @Input() onSwitchDirectionButtonClick: any;
  @Input() onRunButtonClick: any;
  @Input() onStopButtonClick: any;
  @Input() onRestartButtonClick: any;
  @Input() onOpenTutorial: any;
  @Input() statusGraph: any;

  @Output() currentProjectEmitter = new EventEmitter<any>();

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
  stopSvg = require("../../../assets/stop.svg");
  restartSvg = require("../../../assets/restart.svg");

  solutionList = [];
  dirs = [];
  showLoading;

  selectDemoDialog: any;

  currentStep: any;
  currentStepOutPut: any;

  constructor(private dialogService: DialogService,
    private i18n: I18nService,
    private basicService: BasicServiceService,
    private dataService: DataServiceService,
    private toastService: ToastService) {
    this.showLoading = true;
  }

  ngOnInit(): void {
    this.dirs.push(this.dataService.commonFlowunitPath);
    this.loadSolutionData();
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

  handleStopButtonClick = event => {
    this.onStopButtonClick && this.onStopButtonClick();
  };

  handleRestartButtonClick = event => {
    this.onRestartButtonClick && this.onRestartButtonClick();
  };

  openTutorial = event => {
    this.onOpenTutorial && this.onOpenTutorial();
  };

  loadSolutionData() {
    this.basicService.querySolutionList().subscribe(
      (data: any) => {
        let solution = data.demo_list;
        solution.forEach((item) => {
          let obj = { demo: '', desc: '', graphfile: '', name: '' };
          obj.demo = item.demo;
          obj.desc = item.desc;
          obj.graphfile = item.graphfile;
          obj.name = item.name;
          this.solutionList.push(obj);
          let flowunitPath = this.getFlowunitPathFromGraphPath(obj.graphfile, obj.name);
          if (flowunitPath) {
            this.dirs.push(flowunitPath);
          }
        });
        this.dataService.loadFlowUnit(null, this.dirs, null);
        this.showLoading = false;
      },
      (error) => {
        return null;
      });
  }

  getFlowunitPathFromGraphPath(graphPath, graphName) {
    let pos = graphPath.search(/\/graph\//);
    if (pos > -1) {
      return graphPath.slice(0, pos + 1) + "flowunit/";
    }
    return;
  }

  onClickCard(e) {
    this.handleSelectChange(e);
    this.selectDemoDialog.modalInstance.hide();
    this.selectDemoDialog.modalInstance.zIndex = -1;
  }

  showSelectDemoDialog(content: TemplateRef<any>) {
    this.selectDemoDialog = this.dialogService.open({
      id: 'graphSelect',
      width: '900px',
      title: this.i18n.getById('toolBar.chooseDemo'),
      showAnimate: false,
      contentTemplate: content,
      backdropCloseable: true,
      onClose: () => {

      },
      buttons: [],
    });
  }

  selectSolution(selectedName) {
    this.basicService.querySolution(selectedName).subscribe((data) => {
      const response = data;
      if (response.graph) {
        this.sendCurrentProject(data);
      } else {
        this.toastService.open({
          value: [{ severity: 'warn', summary: "Warning!", content: this.i18n.getById('message.selectedSolutionNotFound') }],
          life: 3000,
          style: { top: '100px' }
        });
      }
      this.basicService.getTaskLists().subscribe((data: any) => {
        for (let i of data.job_list) {
          if (i.job_id.indexOf(selectedName.split("/")[0]) > -1) {
            if (i.job_error_msg === "") {
              this.statusGraph = 'running';
            } else {
              this.statusGraph = 'fault';
            }
            return;
          }
        }
        this.statusGraph = 'stop';
      });

    });
  }

  sendCurrentProject(data) {
    this.currentProjectEmitter.emit(data);
  }

  handleSelectChange(e) {
    this.selectSolution(e.demo + "/" + e.graphfile);
  }
}
