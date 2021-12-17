import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { I18nService } from '@core/i18n.service';
import { BasicServiceService } from '@shared/services/basic-service.service';

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
  @Output() newItemEvent = new EventEmitter<string>();
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
  dotSrc: string;
  solutionList = [];
  currentOption = {};
  constructor(private i18n: I18nService,
    private basicService: BasicServiceService) { }

  ngOnInit(): void {
    this.LoadSolutionData();
    this.selectSolution("mnist.toml");
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

  handleSwitchDirectionButtonClick  = event => {
    this.onSwitchDirectionButtonClick && this.onSwitchDirectionButtonClick();
  };

  openTutorial(): void {

  }

  LoadSolutionData() {
    this.basicService.querySolutionList().subscribe(
      (data: any) => {
        data.solution_list.forEach((item) => {
          let obj = { name: '', desc: '', file: '' };
          obj.name = item.name;
          obj.desc = item.desc;
          obj.file = item.file;
          this.solutionList.push(obj);
          //use mnist.toml as default
          if (obj.name === "mnist.toml") {
            this.currentOption = obj.name;
            //this.handleSelectChange(obj);
          }
        })
      },
      (error) => {
        return null;
      })
  }

  selectSolution(selectedName) {

    this.basicService.querySolution(selectedName).subscribe((data) => {
      const response = data;

      // this.initCurrentProlect();
      // this.name = selectedName;
      // if (response.flow) {
      //   if (response.flow.desc) {
      //     this.desc = response.flow.desc;
      //   }
      // }
      if (response.graph) {
        if (response.graph.graphconf) {
          this.dotSrc = response.graph.graphconf;
        }
      }
      this.sendToParent(this.dotSrc);

      // this.dotSrcLastChangeTime = Date.now();
      // if (response.driver) {
      //   this.skipDefault = response.driver['skip-default'];
      //   this.dirs = [];
      //   if (typeof (response.driver.dir) == 'string') {
      //     this.dirs.push(response.driver.dir);
      //   } else {
      //     response.driver.dir.forEach(item => {
      //       this.dirs.push(item)
      //     });
      //   }
      // }
      // this.saveCurrentProject();
      // this.reloadInsertComponent();
      // this.handleZoomResetButtonClick();
    }
    )
  }

  handleSelectChange(e) {
    this.selectSolution(e.name);
  }

  sendToParent(e): void{
    this.newItemEvent.emit(e);
  }

}
