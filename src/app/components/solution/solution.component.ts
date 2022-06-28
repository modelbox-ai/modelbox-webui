import { Component, OnInit, ViewChild } from '@angular/core';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { ToolBarSolutionComponent } from '../tool-bar-solution/tool-bar-solution.component';
import { BasicServiceService } from '@shared/services/basic-service.service';
import { ToastService } from 'ng-devui/toast';
import { AttributePanelComponent } from '../../components/attribute-panel/attribute-panel.component';
import Driver from 'driver.js';
import { I18nService } from '@core/i18n.service';
import { DataServiceService } from '@shared/services/data-service.service';
import { HeaderMainComponent } from '../header-main/header-main.component';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.less']
})
export class SolutionComponent implements OnInit {
  @ViewChild('textEditor') editor: TextEditorComponent;
  @ViewChild('toolBarSolution') tool: ToolBarSolutionComponent;
  @ViewChild('attributePanel') attributePanel: AttributePanelComponent;
  @ViewChild('header') header: HeaderMainComponent;

  handleZoomInButtonClick = () => { };
  handleZoomOutButtonClick = () => { };
  handleZoomFitButtonClick = () => { };
  handleZoomResetButtonClick = () => { };
  handleNodeAttributeChange = () => { };
  handleNodeShapeClick = () => { };

  hasUndo = false;
  hasRedo = false;
  undo: any;
  redo: any;
  switchDirection: any;
  editorResize: any;
  getSvg: any;
  resetUndoStack: any;
  resetUndoAtNextTextChange: any;

  page = "solution";

  project: any = JSON.parse(sessionStorage.getItem('projectSolution')) || {};
  name;
  driver;
  flow;
  graph;
  profile;

  graphs: any = JSON.parse(sessionStorage.getItem('graphsSolution')) || {};

  svgString: string = '';
  dotSrc: string;
  isResizing = false;
  focusedPane: any = '';
  selectedGraphComponents: any = [];
  desc: any;
  dotSrcLastChangeTime: any;
  currentComponent: any;
  showLoading;
  statusGraph = "stop";
  refresh_timer: any;
  msgs: Array<Object> = [];

  constructor(private basicService: BasicServiceService, private toastService: ToastService, private i18n: I18nService,
    private dataService: DataServiceService) {
  }

  ngOnInit(): void {
    this.dataService.currentPage = "solution";

    if (Object.keys(this.project).length !== 0) {
      this.name = this.project.name;
      this.dotSrc = this.project.dotSrc;
      this.flow = this.project.flow;
      this.driver = this.project.driver;
      this.graph = this.project.graph;
      this.profile = this.project.profile;
      this.updateStatus();
    }

  }

  ngAfterViewInit(): void {
    if (Object.keys(this.project).length === 0) {
      this.tool.showSelectDemoDialog(this.tool.selectDemo);
    } else {
      this.refresh_timer = setInterval(() => { this.updateStatus(); }, 5000);
    }
  }

  updateStatus() {
    this.basicService.getTaskLists().subscribe((data: any) => {
      for (let i of data.job_list) {
        if (i.job_id === this.project.name) {
          this.statusGraph = "running";
          if (i.job_error_msg !== '') {
            this.statusGraph = "fault";
          }
        }
      }
    });
  }

  handleTextChange = (text, undoRedoState) => {
    const name =
      this.name || (text ? this.createUntitledName(this.graphs) : '');
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
    if (event && document.getElementsByTagName('svg').length > 0) {
      const svgDomW = document.getElementsByTagName('svg')[0];
      svgDomW.setAttribute('width', "100%");
      svgDomW.setAttribute('height', "100%");
    }

    if (name === "left") {
      sessionStorage.setItem('leftSpliterSize', String(event.sizes[0]))
    } else if (name === "center") {
      sessionStorage.setItem('centerSplitterSize', String(event.sizes[0]))
    }
    this.editorResize();
  }

  handleGutterStart = (event) => {
    this.isResizing = true;
    if (event && document.getElementsByTagName('svg').length > 0) {
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

  registerNodeShapeClick = (handleNodeShapeClick, context) => {
    this.handleNodeShapeClick = handleNodeShapeClick.bind(context);
  };

  getChildData(e): void {
    this.dotSrc = e;
  }

  getSvgString() {
    const svg = this.getSvg();
    const serializer = new XMLSerializer();
    return svg ? serializer.serializeToString(svg) : this.svgString;
  }

  updateConfig(e) {
    this.currentComponent = e;
  }

  handleCurrentProjectChange(e) {
    if (e && e.graph) {
      this.dotSrc = e.graph.graphconf;
      this.driver = e.driver;
      this.flow = e.flow;
      this.graph = e.graph;
      this.profile = e.profile;
    }
  }

  saveCurrentProject() {
    this.setPersistentState(
      {
        projectSolution: this.getProjectJson()
      });
  }

  saveGraphs() {
    this.saveCurrentProject();
    this.setPersistentState({
      graphsSolution: {
        ...this.graphs,
      }
    });
  }

  renameGraphSrc(newName) {
    let name = newName.replace(/[\. -]/gi, '_');
    this.dotSrc = this.dotSrc.replace(/(\s*)(digraph|graph)\s(.*){/gi, '$1$2 ' + name + ' {');
  }

  getProjectJson() {
    const projectdata = {
      name: this.getGraphNameFromGraph(this.dotSrc),
      dotSrc: this.dotSrc,
      driver: this.driver,
      graph: this.graph,
      flow: this.flow,
      profile: this.profile
    }
    projectdata.graph.graphconf = this.dotSrc;

    return projectdata;
  }

  getGraphNameFromGraph(graph) {
    let graphName = "";
    if (graph) {
      let n = graph.match(/(?<=digraph ).*?(?= {)/gm);
      if (n) {
        graphName = n[0];
      }
    }
    return graphName;
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
        sessionStorage.setItem(key, value);
      });
    }
    return obj;
  }

  handleTutorials = () => {
    const driver = new Driver({
      opacity: 0,
    });
    // Define the steps for introduction
    driver.defineSteps([
      {
        element: '#toolBarSolution',
        popover: {
          title: this.i18n.getById('tutorial.toolbar'),
          description: this.i18n.getById("tutorial.toolbarGuide"),
          position: 'buttom'
        }
      },
      {
        element: '#undoredo',
        popover: {
          title: this.i18n.getById('tutorial.undoredo'),
          description: this.i18n.getById("tutorial.redoGuide"),
          position: 'buttom'
        }
      },
      {
        element: '#zoominout',
        popover: {
          title: this.i18n.getById('tutorial.zoominout'),
          description: this.i18n.getById("tutorial.zoomGuide"),
          position: 'buttom'
        }
      },
      {
        element: '#zoom-reset',
        popover: {
          title: this.i18n.getById('toolBar.zoomResetButton'),
          description: this.i18n.getById("tutorial.restGuide"),
          position: 'buttom'
        }
      },
      {
        element: '#zoom-fit',
        popover: {
          title: this.i18n.getById('toolBar.zoomFitButton'),
          description: this.i18n.getById("tutorial.fitGuide"),
          position: 'buttom'
        }
      },
      {
        element: '#switch',
        popover: {
          title: this.i18n.getById('toolBar.switchButton'),
          description: this.i18n.getById("tutorial.layoutGuide"),
          position: 'buttom'
        }
      },
      {
        element: '#run',
        popover: {
          title: this.i18n.getById('toolBar.runGraphButton'),
          description: this.i18n.getById("tutorial.runGuide"),
          position: 'buttom'
        }
      },
      {
        element: '#graph-guide',
        popover: {
          title: '画布',
          description: this.i18n.getById("tutorial.graphGuide"),
          position: 'right'
        }
      },
      {
        element: '#text-guide',
        popover: {
          title: '编辑器',
          description: this.i18n.getById("tutorial.textGuide"),
          position: 'top'
        }
      }
    ]);
    // Start the introduction
    driver.start();
  }

  introduce: any = new Driver({
    opacity: 0.5,
    onHighlighted: (element) => {
      const header = document.getElementById('header-nav');
      if (header.contains(element.getNode())) {
        const stage = document.getElementById('driver-highlighted-element-stage');
        stage.style.backgroundColor = 'rgba(255, 255, 255,0.15)';
      }
      const body = document.getElementsByTagName('body');
      body[0].style.overflowY = 'hidden';
    }
  });

  createUntitledName = (graphs, currentName?) => {
    const baseName = 'Untitled';
    let newName = baseName;
    while (graphs[newName] || newName === currentName) {
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
  handleDotSrcChange(e) {
    this.dotSrc = e;
  }

  handleRunButtonClick = () => {
    //saveToBrowser
    this.showLoading = true;
    this.statusGraph = "running";
    this.graphs = {};
    this.project = JSON.parse(sessionStorage.getItem("projectSolution"));
    this.saveCurrentProject();
    this.graphs[this.project.name] = this.project;
    this.saveGraphs();
    //run
    let option = this.createOptionFromProject(this.project);
    this.basicService.createTask(option)
      .subscribe(async (data: any) => {
        //提示任务运行状态
        this.msgs = [
          { severity: 'success', summary: "Success", content: this.i18n.getById('message.checkInTaskPage') },
        ];
        await new Promise(r => setTimeout(r, 1000));
        this.showLoading = false;
        this.header.goManagement();
      }, error => {
        this.statusGraph = "fault";
        if (error.error != null) {
          this.msgs = [
            { severity: 'error', summary: error.error.error_code, content: error.error.error_msg },
          ];
        }
        this.showLoading = false;
      }
      );
  }

  handleStopButtonClick = (graphName) => {
    //saveToBrowser
    this.showLoading = true;
    if (!graphName && this.project && this.project.graph) {
      graphName = this.getGraphNameFromGraph(this.project.graph.graphconf);
    }
    this.statusGraph = "stop";

    this.basicService.getTaskLists().subscribe((data: any) => {
      for (let i of data.job_list) {
        if (graphName === i.job_id) {
          this.basicService.deleteTask(i.job_id).subscribe(data => {
            this.msgs = [
              { severity: 'success', content: this.i18n.getById('management.taskHasBeenDeletedSuccessfully') },
            ];
            this.statusGraph = "stop";
          });
        }
      }
      this.showLoading = false;
    });
  }

  handleRestartButtonClick = (graphName) => {
    this.showLoading = true;
    if (!graphName && this.project && this.project.graph) {
      graphName = this.getGraphNameFromGraph(this.project.graph.graphconf);
    }

    this.basicService.getTaskLists().subscribe((data: any) => {
      for (let i of data.job_list) {
        if (graphName === i.job_id) {
          this.basicService.deleteTask(i.job_id).subscribe(data => {
            this.msgs = [
              { severity: 'success', content: this.i18n.getById('management.taskHasBeenDeletedSuccessfully') },
            ];
            this.statusGraph = "stop";
            this.handleRunButtonClick();
          });
        }
      }
      this.showLoading = false;
    });
  }

  statusGraphUpdate(e) {
    let graphName = e.split("/")[0];
    this.basicService.getTaskLists().subscribe((data: any) => {

      for (let i of data.job_list) {
        if (graphName === i.job_id) {
          this.statusGraph = "running";
        }
      }
    });
  }

  handleGraphComponentSelect = components => {
    this.selectedGraphComponents = components;
    if (components.length === 1 && components[0].name.indexOf('->') === -1) {
      this.currentComponent = components[0];
      this.currentComponent.attributes = Object.keys(
        this.currentComponent.attributes
      ).map(k => {
        return {
          key: k,
          value: this.currentComponent.attributes[k],
        };
      });

      try {
        let flowunit = ""
        let device = "cpu"
        this.currentComponent.attributes.forEach(item => {
          if (item.key === "flowunit") {
            flowunit = item.value
          } else if (item.key === "device") {
            device = item.value
          }
        })
      } catch (error) {
        return;
      }
    } else {
      this.currentComponent = null;
    }
  };

  createOptionFromProject = (item) => {
    let params = {};
    for (let ele of this.tool.solutionList) {
      if (ele.name === item.name) {
        item.name = ele.graphfile;
      }
    }
    params = {
      job_id: item.name,
      job_graph: {
        flow: {
          desc: item.flow.desc,
        },
        driver: {
          "skip-default": false,
          dir: item.driver.dir,
        },
        profile: {
          profile: false,
          trace: false,
          session: false,
          dir: this.dataService.defaultPerfDir,
        },
        graph: {
          graphconf: item.graph.graphconf,
          format: this.dataService.defaultFormat,
        },
      }
    }
    params["graph_name"] = params["job_id"];
    params["graph"] = params["job_graph"];
    return params;
  }
}
