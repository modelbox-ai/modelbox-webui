import { Component, OnInit, ViewChild } from '@angular/core';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { ToolBarSolutionComponent } from '../tool-bar-solution/tool-bar-solution.component';
import { BasicServiceService } from '@shared/services/basic-service.service';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.less']
})
export class SolutionComponent implements OnInit {
  @ViewChild('textEditor') editor: TextEditorComponent;
  @ViewChild('toolBarSolution') tool: ToolBarSolutionComponent;
  name: string = localStorage.getItem('project.name') || '';
  hasUndo = false;
  hasRedo = false;

  undo: any;
  redo: any;
  switchDirection: any;
  editorResize: any;
  getSvg: any;
  resetUndoStack: any;
  resetUndoAtNextTextChange: any;

  svgString: string = '';
  dotSrc: string;
  isResizing = false;
  focusedPane: any = '';
  selectedGraphComponents: any = [];
  project: any = JSON.parse(localStorage.getItem('project')) || {};
  projects: any = JSON.parse(localStorage.getItem('projects')) || {};
  desc: any;
  dotSrcLastChangeTime: any;

  handleZoomInButtonClick = () => { };
  handleZoomOutButtonClick = () => { };
  handleZoomFitButtonClick = () => { };
  handleZoomResetButtonClick = () => { };
  handleNodeAttributeChange = () => { };

  constructor(private basicService: BasicServiceService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  handleTextChange = (text, undoRedoState) => {
    const name =
      this.name || (text ? this.createUntitledName(this.projects) : '');
    this.name = name;
    this.dotSrc = text;
    this.saveCurrentProject();

    if (this.resetUndoAtNextTextChange) {
      this.resetUndoStack();
      undoRedoState = {
        hasUndo: false,
        hasRedo: false,
      };
      this.resetUndoAtNextTextChange = false;
    }
    this.hasUndo = !!undoRedoState?.hasUndo;
    this.hasRedo = !!undoRedoState?.hasRedo;
  };

  handleGraphInitialized = () => {
    this.setPersistentState({
      svgString: this.getSvgString(),
    });
  };

  handleUndoButtonClick = () => {
    this.undo();
  };

  handleRedoButtonClick = () => {
    this.redo();
  };

  handleSwitchDirectionButtonClick = () => {
    this.switchDirection();
  };

  handleGutterEnd = (event, name) => {
    this.isResizing = false;
    if (event) {
      const svgDomW = document.getElementsByTagName('svg')[0];
      svgDomW.setAttribute('width', "100%");
      svgDomW.setAttribute('height', "100%");
    }

    if (name === "left") {
      localStorage.setItem('leftSpliterSize', String(event.sizes[0]))
    } else if (name === "center") {
      localStorage.setItem('centerSplitterSize', String(event.sizes[0]))
    }
    this.editorResize();
  }

  handleGutterStart = (event) => {
    this.isResizing = true;
    if (event) {
      const svgDomW = document.getElementsByTagName('svg')[0];
      svgDomW.setAttribute('width', "100%");
      svgDomW.setAttribute('height', "100%");
    }
  }

  registerUndo = (undo, context) => {
    this.undo = undo.bind(context);
  };

  registerRedo = (redo, context) => {
    this.redo = redo.bind(context);
  };

  registerSwitchDirectionButtonClick = (switchDirection, context) => {
    this.switchDirection = switchDirection.bind(context);
  };

  registerEditorResize = (resize, context) => {
    this.editorResize = resize.bind(context);
  }

  registerUndoReset = (resetUndoStack, context) => {
    this.resetUndoStack = resetUndoStack.bind(context);
  };

  registerGetSvg = (getSvg, context) => {
    this.getSvg = getSvg.bind(context);
  };

  registerZoomInButtonClick = (handleZoomInButtonClick, context) => {
    this.handleZoomInButtonClick = handleZoomInButtonClick.bind(context);
  };

  registerZoomOutButtonClick = (handleZoomOutButtonClick, context) => {
    this.handleZoomOutButtonClick = handleZoomOutButtonClick.bind(context);
  };

  registerZoomFitButtonClick = (handleZoomFitButtonClick, context) => {
    this.handleZoomFitButtonClick = handleZoomFitButtonClick.bind(
      context
    );
  };

  registerZoomResetButtonClick = (handleZoomResetButtonClick, context) => {
    this.handleZoomResetButtonClick = handleZoomResetButtonClick.bind(context);
  };

  registerNodeAttributeChange = (handleNodeAttributeChange, context) => {
    this.handleNodeAttributeChange = handleNodeAttributeChange.bind(context);
  };

  getChildData(e): void {
    this.dotSrc = e;
  }

  getSvgString() {
    const svg = this.getSvg();
    const serializer = new XMLSerializer();
    return svg ? serializer.serializeToString(svg) : this.svgString;
  }

  saveCurrentProject() {
    this.setPersistentState(
      {
        project: this.getProjectJson()
      });
  }

  saveProjects() {
    this.saveCurrentProject();
    this.setPersistentState({
      projects: {
        ...this.projects,
      }
    });
  }

  renameGraphSrc(newName) {
    let name = newName.replace(/[\. -]/gi, '_');
    this.dotSrc = this.dotSrc.replace(/(\s*)(digraph|graph)\s(.*){/gi, '$1$2 ' + name + ' {');
  }

  getProjectJson() {
    const projectdata = {
      name: this.name,
      desc: this.desc,
      dotSrc: this.dotSrc,
    }

    return projectdata;
  }
  setPersistentState(obj) {
    if (obj !== null) {
      Object.keys(obj).forEach(key => {
        let value = obj[key];
        this[key] = value;
        if (typeof value === 'boolean') {
          value = value.toString;
        } else if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
      });
    }
    return obj;
  }

  createUntitledName = (projects, currentName?) => {
    const baseName = 'Untitled';
    let newName = baseName;
    while (projects[newName] || newName === currentName) {
      newName = baseName + ' ' + (Number(newName.replace(baseName, '')) + 1);
    }
    return newName;
  };

  handleTextEditorFocus = () => {
    this.setFocus('TextEditor');
  };
  setFocus = focusedPane => {
    this.focusedPane = focusedPane;
  };

  handleTextEditorBlur = () => {
    this.setFocusIfFocusIs('TextEditor', null);
  };

  setFocusIfFocusIs = (currentlyFocusedPane, newFocusedPane) => {
    if (this.focusedPane === currentlyFocusedPane) {
      this.focusedPane = newFocusedPane;
    }
  };

  handleRunButtonClick = () => {
    //saveToBrowser
    this.projects = {};
    this.name = this.basicService.currentSolution;
    this.project.name = this.name;
    this.saveCurrentProject();
    this.projects[this.project.name] = this.project;
    this.saveProjects();
    //run
    let option = this.createOptionFromProject(this.project);
    this.basicService.queryCreateTask(option)
      .subscribe((data: any) => {
        //提示任务运行状态
        debugger
        if (data) {}
      });
  }

  createOptionFromProject = (item) => {
    let params = {};
    params = {
      job_id: item.name,
      job_graph: {
        flow: {
          desc: item.desc,
        },
        driver: {
          "skip-default": item.skipDefault,
          dir: item.dirs,
        },
        profile: {
          profile: item.settingPerfEnable,
          trace: item.settingPerfTraceEnable,
          session: item.settingPerfSessionEnable,
          dir: item.settingPerfDir,
        },
        graph: {
          graphconf: item.dotSrc,
          format: "graphviz",
        },
      }
    }
    return params;
  }
}
