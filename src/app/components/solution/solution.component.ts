import { Component, OnInit, ViewChild } from '@angular/core';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { ToolBarSolutionComponent } from '../tool-bar-solution/tool-bar-solution.component';

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
  projects: any = JSON.parse(localStorage.getItem('projects')) || {};
  desc: any;
  dotSrcLastChangeTime: any;

  handleZoomInButtonClick = () => { };
  handleZoomOutButtonClick = () => { };
  handleZoomFitButtonClick = () => { };
  handleZoomResetButtonClick = () => { };

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }


  handleTextChange = (text, undoRedoState) => {
    const name =
      this.name || (text ? this.createUntitledName(this.projects) : '');
    this.name = name

    //this.isSaved = false;
    this.dotSrc = text;
    //this.dotSrcLastChangeTime = Date.now();
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
    //this.graphInitialized = true;
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



  // registerNodeShapeClick = (handleNodeShapeClick, context) => {
  //   this.handleNodeShapeClick = handleNodeShapeClick.bind(context);
  // };

  // registerNodeShapeDragStart = (handleNodeShapeDragStart, context) => {
  //   this.handleNodeShapeDragStart = handleNodeShapeDragStart.bind(context);
  // };

  // registerNodeShapeDragEnd = (handleNodeShapeDragEnd, context) => {
  //   this.handleNodeShapeDragEnd = handleNodeShapeDragEnd.bind(context);
  // };

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

}
