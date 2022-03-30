import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { I18nService } from '@core/i18n.service';
import { BasicServiceService } from '@shared/services/basic-service.service';
import { DataServiceService } from '@shared/services/data-service.service';
import { ToastService } from 'ng-devui/toast';

declare const require: any
@Component({
  selector: 'app-tool-bar-solution',
  templateUrl: './tool-bar-solution.component.html',
  styleUrls: ['./tool-bar-solution.component.less']
})
export class ToolBarSolutionComponent implements OnInit {
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
  @Input() onOpenTutorial: any;
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
  

  solutionList = [];
  dirs = [];
  showLoading;

  currentOption = localStorage.getItem('currentSolution') || {};
  
  constructor(private i18n: I18nService,
    private basicService: BasicServiceService,
    private dataService: DataServiceService,
    private toastService: ToastService) { 
      this.showLoading = true;
    }

  ngOnInit(): void {
    this.dirs.push(this.dataService.commonFlowunitPath);
    this.loadSolutionData();
    this.selectSolution(this.dataService.defaultSolutionGraph);
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

  openTutorial = event => {
    this.onOpenTutorial && this.onOpenTutorial();
  };

  loadSolutionData() {
    this.basicService.querySolutionList().subscribe(
      (data: any) => {
        let solution = data.demo_list;
        solution.forEach((item) => {
          let obj = { name: '', desc: '', file: '' };
          obj.name = item.name;
          obj.desc = item.desc;
          obj.file = item.graphfile;
          this.solutionList.push(obj);
          let flowunitPath = this.getFlowunitPathFromGraphPath(obj.file, obj.name);
          if (flowunitPath){
            this.dirs.push(flowunitPath);
          }
        });
        this.dataService.loadFlowUnit(null, this.dirs, null);
      },
      (error) => {
        return null;
      });
  }

  getFlowunitPathFromGraphPath(graphPath, graphName){
    let pos = graphPath.search(/\/graph\//);
    if (pos > -1){
      return graphPath.slice(0,pos + 1) + "flowunit/";
    }
    return;
  }

  selectSolution(selectedName) {
    this.basicService.querySolution(selectedName).subscribe((data) => {
      const response = data;
      if (response.graph) {
        this.dataService.currentSolution = selectedName;
        this.dataService.currentSolutionProject = data;
        this.sendCurrentProject(data);
        this.currentOption = selectedName;
      }else{
        this.toastService.open({
          value: [{ severity: 'warn', summary: "Warning!", content: this.i18n.getById('message.selectedSolutionNotFound') }],
          life: 3000
        });
      }
      
    });
  }

  sendCurrentProject(data){
    this.currentProjectEmitter.emit(data);
  }

  handleSelectChange(e) {
    this.selectSolution(e.name);
  }
}
