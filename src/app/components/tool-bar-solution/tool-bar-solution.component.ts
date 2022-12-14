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

  @ViewChild("selectDemo", { static: true }) selectDemo: TemplateRef<any>;
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
  @Input() msgs: any;

  @Output() currentProjectEmitter = new EventEmitter<any>();
  @Output() loadFlowunitEmitter = new EventEmitter<any>();

  solutionList: any;
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
          if (this.solutionList === undefined) {
            this.solutionList = [];
          }
          this.solutionList.push(obj);

          let flowunitPath = this.getFlowunitPathFromGraphPath(obj.graphfile);
          if (flowunitPath) {
            this.dirs.push(flowunitPath);
          }

        });

        this.showLoading = false;
      },
      (error) => {
        return null;
      });
  }

  getFlowunitPathFromGraphPath(graphPath) {
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

    setTimeout(() => {
      this.handleZoomResetButtonClick(e);
    }, 1000);

  }

  showSelectDemoDialog(content: TemplateRef<any>) {
    this.selectDemoDialog = this.dialogService.open({
      id: 'graphSelect',
      width: '900px',
      title: this.i18n.getById('toolBar.chooseDemo'),
      showAnimate: false,
      contentTemplate: content,
      backdropCloseable: false,
      onClose: () => {

      },
      buttons: [],
    });
    return this.selectDemoDialog;
  }

  selectSolution(selectedName) {
    this.statusGraph = 'stop';
    this.basicService.querySolution(selectedName).subscribe((data) => {
      const response = data;
      this.dirs = this.dirs.concat(data.driver.dir);
      if (response.graph) {
        this.sendCurrentProject(data);
      } else {
        this.msgs = [
          { severity: 'warn', summary: "Warning!", content: this.i18n.getById('message.selectedSolutionNotFound') }
        ];
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
      let param = [false, this.dirs, null];
      this.loadFlowunitEmitter.emit(param);
    });
  }

  sendCurrentProject(data) {
    this.currentProjectEmitter.emit(data);
  }

  handleSelectChange(e) {
    this.selectSolution(e.demo + "/" + e.graphfile);
  }
}
