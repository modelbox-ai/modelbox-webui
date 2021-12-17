import {
  Component,
  TemplateRef,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { DialogService, ModalService } from 'ng-devui/modal';
import { InsertPanelsComponent } from '../../components/insert-panels/insert-panels.component';
import { BasicServiceService } from '@shared/services/basic-service.service';
import { I18nService } from '@core/i18n.service';
import { SplitComponent } from 'angular-split'
import { TextEditorComponent } from '../../components/text-editor/text-editor.component';
import { ToolBarComponent } from '../../components/tool-bar/tool-bar.component';
import { AttributePanelComponent } from '../../components/attribute-panel/attribute-panel.component';
import { DataServiceService } from '@shared/services/data-service.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent {
  @ViewChild('splitV') splitV: SplitComponent;
  @ViewChild('splitH') splitH: SplitComponent;

  defaultPerfDir: string = '/tmp/modelbox/perf';

  defaultSrc: string = `digraph {
    node [shape=Mrecord];
  }`;
  activeEditor: boolean = true;
  activeTaskLists: boolean = false;
  componentPanelEar: string = this.i18n.getById('panelEar.componentLabel');
  editToolPanelEar: string = this.i18n.getById('panelEar.editToolLabel');

  name: string = localStorage.getItem('project.name') || '';
  desc: string = localStorage.getItem('project.desc') || '';
  dotSrcLastChangeTime: any =
    Number(localStorage.getItem('project.dotSrcLastChangeTime')) || Date.now();
  dotSrc: string;
  svgString: string = '';
  skipDefault: any = false; content: TemplateRef<any>;
  res: any;
  dirs: any = [];
  isSaved = false;
  graphRandDir: any;
  settingPerfEnable = false;
  settingPerfTraceEnable = false;
  settingPerfSessionEnable = false;
  settingPerfDir: any;
  model = 1;
  collapsed = false;
  editorCollapsed = false;
  getSvg: any;
  focusedPane: any = '';
  error: any;
  undo: any;
  redo: any;
  switchDirection: any;
  editorResize: any;
  hasUndo = false;
  hasRedo = false;
  isResizing = false;
  resetUndoStack: any;
  selectedGraphComponents: any = [];
  graphInitialized = false;
  leftSpliterSize = 14;
  centerSplitterSize = 95;
  holdOff = localStorage.getItem('holdOff') || 0.2;
  fontSize = localStorage.getItem('fontSize') || 12;
  tabSize = Number(localStorage.getItem('tabSize')) || 4;
  resetUndoAtNextTextChange: any;
  projects: any = JSON.parse(localStorage.getItem('projects')) || {};
  state: any;
  solutionList: any = [];
  currentComponent: any;
  InsertPanels: InsertPanelsComponent;
  AttributePanel: AttributePanelComponent;
  @ViewChild('attributePanel') attributePanel: AttributePanelComponent;
  @ViewChild('textEditor') editor: TextEditorComponent;
  @ViewChild('toolBar') toolBar: ToolBarComponent;
  handleNodeShapeClick = () => { };
  handleNodeShapeDragStart = () => { };
  handleNodeShapeDragEnd = () => { };
  handleZoomInButtonClick = () => { };
  handleZoomOutButtonClick = () => { };
  handleZoomFitButtonClick = () => { };
  handleZoomResetButtonClick = () => { };
  handleNodeAttributeChange = () => { };
  handleSwitchButtonClick = () => { }
  constructor(private dialogService: DialogService,
    private i18n: I18nService,
    private basicService: BasicServiceService,
    private dataService: DataServiceService,) {

    const current_project = JSON.parse(localStorage.getItem('project'));
    if (current_project) {
      this.loadProjectFromJson(current_project);
      if (this.defaultSrc == this.dotSrc) {
        this.skipDefault = false;
      }
    }

    if ((typeof (this.dotSrc) == "undefined") || this.dotSrc === null || this.dotSrc === '') {
      this.dotSrc = this.defaultSrc;
    }
  }

  click(tab: string): void {
    if (tab === 'editor') {
      this.activeEditor = true;
      this.activeTaskLists = false;
    } else {
      this.activeEditor = false;
      this.activeTaskLists = true;
    }
    this.currentComponent = null;
  }
  
  ngOnInit(): void {
    this.LoadSolutionData();

    this.reloadInsertComponent();
  }

  ngAfterViewInit() {
    this.splitH.dragProgress$.subscribe(x => {
      this.handleGrutterMove(x);
    });
    this.splitV.dragProgress$.subscribe(x => {
    });
  }

  reloadInsertComponent() {
    if (typeof this.InsertPanels === 'undefined') {
      return
    }

    this.InsertPanels.loadFlowUnit(this.skipDefault, this.dirs);
  }

  initCurrentProlect() {

    this.name = this.createUntitledName(this.projects);
    this.desc = "";
    this.dotSrc = this.defaultSrc;
    this.dotSrcLastChangeTime = Date.now();
    this.svgString = this.getSvgString();
    this.svgString = '';
    this.skipDefault = false;
    this.dirs = [];
    this.settingPerfEnable = false;
    this.settingPerfTraceEnable = false;
    this.settingPerfSessionEnable = false;
    this.settingPerfDir = this.defaultPerfDir + "/" + this.name

    this.reloadInsertComponent();
  }

  loadProjectFromJson(project) {
    this.name = project.name;
    this.desc = project.desc;
    this.dotSrc = project.dotSrc;
    if (typeof this.dotSrc === 'undefined') {
      this.dotSrc = this.defaultSrc;
    }

    this.dotSrcLastChangeTime = project.dotSrcLastChangeTime;
    this.svgString = project.svgString;
    this.skipDefault = project.skipDefault;
    if (typeof this.skipDefault === 'undefined') {
      this.skipDefault = false;
    }

    this.dirs = project.dirs;
    if (typeof this.dirs === 'undefined') {
      this.dirs = []
    }
    this.settingPerfEnable = project.settingPerfEnable;
    this.settingPerfTraceEnable = project.settingPerfTraceEnable;
    this.settingPerfSessionEnable = project.settingPerfSessionEnable;
    this.settingPerfDir = project.settingPerfDir;
  }

  getProjectJson() {
    const projectdata = {
      name: this.name,
      desc: this.desc,
      dotSrc: this.dotSrc,
      dotSrcLastChangeTime: this.dotSrcLastChangeTime,
      svgString: this.getSvgString(),
      skipDefault: this.skipDefault,
      dirs: this.dirs,
      settingPerfEnable: this.settingPerfEnable,
      settingPerfTraceEnable: this.settingPerfTraceEnable,
      settingPerfSessionEnable: this.settingPerfSessionEnable,
      settingPerfDir: this.settingPerfDir,
    }

    return projectdata;
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

  // 设置当编辑器收起时，svg的高度变为100%
  onEditorToggleDone = (event?) => {
    if (event) {
      const svgDomH = document.getElementsByTagName('svg')[0];
      svgDomH.setAttribute('height', "100%");
    }
  }
  // 设置当组件库收起时，svg的宽度变为100%
  onInsertToggleDone = (event?) => {
    if (event) {
      const svgDomW = document.getElementsByTagName('svg')[0];
      svgDomW.setAttribute('width', "100%");
    }
  }

  handleError = error => {
    if (error) {
      error.numLines = this.dotSrc.split('\n').length;
    }
    if (JSON.stringify(error) !== JSON.stringify(this.error)) {
      this.error = error;
    }
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

  registerEditorResize = (resize, context) => {
    this.editorResize = resize.bind(context);
  }

  registerUndoReset = (resetUndoStack, context) => {
    this.resetUndoStack = resetUndoStack.bind(context);
  };

  registerGetSvg = (getSvg, context) => {
    this.getSvg = getSvg.bind(context);
  };

  registerNodeShapeClick = (handleNodeShapeClick, context) => {
    this.handleNodeShapeClick = handleNodeShapeClick.bind(context);
  };

  registerNodeShapeDragStart = (handleNodeShapeDragStart, context) => {
    this.handleNodeShapeDragStart = handleNodeShapeDragStart.bind(context);
  };

  registerNodeShapeDragEnd = (handleNodeShapeDragEnd, context) => {
    this.handleNodeShapeDragEnd = handleNodeShapeDragEnd.bind(context);
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
  registerSwitchDirectionButtonClick = (switchDirection, context) => {
    this.switchDirection = switchDirection.bind(context);
  };

  registerZoomResetButtonClick = (handleZoomResetButtonClick, context) => {
    this.handleZoomResetButtonClick = handleZoomResetButtonClick.bind(context);
  };

  registerNodeAttributeChange = (handleNodeAttributeChange, context) => {
    this.handleNodeAttributeChange = handleNodeAttributeChange.bind(context);
  };

  setEditorMarkers(components) {
    let marks = []
    for (const component of components) {
      for (const location of component.locations) {
        let mark = {
          startRow: location.start.line - 1,
          startCol: location.start.column - 1,
          endRow: location.end.line - 1,
          endCol: location.end.column - 1,
        }
        marks.push(mark);
      }
    }
    this.editor.handleMarkers(marks)
  }

  handleGraphComponentSelect = components => {
    this.selectedGraphComponents = components;
    this.setEditorMarkers(components);

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
        if (!this.InsertPanels.isFlowUnitExist(
          flowunit, device
        )) {
          return;
        }
      } catch (error) {
        return;
      }
    } else {
      this.currentComponent = null;
    }
  };

  handleGraphFocus = () => {
    this.setFocus('Graph');
  };

  createUntitledName = (projects, currentName?) => {
    const baseName = 'Untitled';
    let newName = baseName;
    while (projects[newName] || newName === currentName) {
      newName = baseName + ' ' + (Number(newName.replace(baseName, '')) + 1);
    }
    return newName;
  };


  handleTextChange = (text, undoRedoState) => {
    const name =
      this.name || (text ? this.createUntitledName(this.projects) : '');
    this.name = name

    this.isSaved = false;
    this.dotSrc = text;
    this.dotSrcLastChangeTime = Date.now();
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

  handleInsertPanelsClick = () => {
    this.setFocus('InsertPanels');
  };

  regFlowUnitPanel = (panel) => {
    this.InsertPanels = panel;
    this.reloadInsertComponent();
  }

  setFocus = focusedPane => {
    this.focusedPane = focusedPane;
  };

  handleTextEditorFocus = () => {
    this.setFocus('TextEditor');
  };

  handleTextEditorBlur = () => {
    this.setFocusIfFocusIs('TextEditor', null);
  };

  setFocusIfFocusIs = (currentlyFocusedPane, newFocusedPane) => {
    if (this.focusedPane === currentlyFocusedPane) {
      this.focusedPane = newFocusedPane;
    }
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

  handleGrutterMove = (size) => {
    const svgDomW = document.getElementsByTagName('svg')[0];
    svgDomW.setAttribute('width', "100%");
    svgDomW.setAttribute('height', "100%");
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

  handleGraphInitialized = () => {
    this.graphInitialized = true;
    this.setPersistentState({
      svgString: this.getSvgString(),
    });
  };

  handleNewClick = () => {
    if (this.isSaved === false) {
      const results = this.dialogService.open({
        id: 'new-ok',
        title: this.i18n.getById('toolBar.notSavedTitle'),
        content: this.i18n.getById('toolBar.notSavedMessage'),
        width: '400px',
        showAnimation: true,
        buttons: [{
          cssClass: 'danger',
          text: this.i18n.getById('modal.okButton'),
          disabled: false,
          handler: ($event: Event) => {
            results.modalInstance.hide();
            results.modalInstance.zIndex = -1;
            this.initCurrentProlect();
            this.resetUndoAtNextTextChange = true;
            setTimeout(() => {
              this.handleZoomResetButtonClick();
            }, 1000)
          },
        },
        {
          id: 'new-cancel',
          cssClass: 'common',
          text: this.i18n.getById('modal.cancelButton'),
          handler: ($event: Event) => {
            results.modalInstance.hide();
            results.modalInstance.zIndex = -1;
          },
        },],
        onClose: ($event: Event) => {
        }
      });

      return;
    }

    this.initCurrentProlect();
    this.resetUndoAtNextTextChange = true;
    this.handleZoomResetButtonClick();
  };

  renameGraphSrc(newName) {
    let name = newName.replace(/[\. -]/gi, '_');
    this.dotSrc = this.dotSrc.replace(/(\s*)(digraph|graph)\s(.*){/gi, '$1$2 ' + name + ' {');
  }

  handleSaveAsToBrowser(newName, newDotSrc = '', rename = false) {
    if (newName === null) {
      return;
    }

    const currentName = this.name;
    if (rename) {
      delete this.projects[currentName];
    }


    if (this.settingPerfDir === this.defaultPerfDir + "/" + this.name) {
      this.settingPerfDir = this.defaultPerfDir + "/" + newName;
    }
    this.name = newName;
    this.dotSrc = newDotSrc ? newDotSrc : newName ? this.dotSrc : '',
      this.dotSrcLastChangeTime = newDotSrc
        ? Date.now()
        : this.dotSrcLastChangeTime;
    this.saveCurrentProject();
    this.projects[newName] = this.getProjectJson();
    this.saveProjects();
    this.isSaved = true;
    this.renameGraphSrc(this.name)
  }

  getToolBarProjectsChange(e) {
    this.projects = e
  }

  handleRedoButtonClick = () => {
    this.redo();
  };

  handleUndoButtonClick = () => {
    this.undo();
  };

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

  getSvgString() {
    const svg = this.getSvg();
    const serializer = new XMLSerializer();
    return svg ? serializer.serializeToString(svg) : this.svgString;
  }

  saveSetting(context: any) {

    let newName = context.name;
    this.name = newName;
    this.desc = context.desc;
    let rankdir = context.radioValue;
    this.skipDefault = context.skipDefault;
    if (typeof (context.flowunitPath) === "string") {
      this.dirs = context.flowunitPath.replace(/\s\s*$/gm, "").split("\n");
    } else {
      this.dirs = [];
    }

    this.renameGraphSrc(newName);
    this.settingPerfEnable = context.perfEnable;
    this.settingPerfTraceEnable = context.perfTraceEnable;
    this.settingPerfSessionEnable = context.perfSessionEnable;

    if (this.settingPerfDir === this.defaultPerfDir + "/" + this.name) {
      this.settingPerfDir = this.defaultPerfDir + "/" + newName;
    } else {
      this.settingPerfDir = context.perfPath;
    }

    this.saveCurrentProject();
    this.reloadInsertComponent();
  }

  showGraphSettingDialog(content: TemplateRef<any>) {
    const results = this.dialogService.open({
      id: 'graphSetting',
      width: '700px',
      title: this.i18n.getById('toolBar.graphSettingButton'),
      showAnimate: false,
      contentTemplate: content,
      backdropCloseable: true,
      onClose: () => {

      },
      buttons: [{
        cssClass: 'danger',
        text: this.i18n.getById('modal.okButton'),
        disabled: false,
        handler: ($event: Event) => {
          results.modalInstance.hide();
          results.modalInstance.zIndex = -1;
          this.saveSetting(this.toolBar.formData);
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
  updateConfig(e) {
    this.currentComponent = e;
  }

  showSelectDialog(content: TemplateRef<any>) {
    const results = this.dialogService.open({
      id: 'graphSelect',
      width: '900px',
      title: this.i18n.getById('toolBar.selectDialogButton'),
      showAnimate: false,
      contentTemplate: content,
      backdropCloseable: true,
      onClose: () => {

      },
      buttons: [{
        cssClass: 'danger',
        text: this.i18n.getById('modal.okButton'),
        disabled: false,
        handler: ($event: Event) => {
          results.modalInstance.hide();
          results.modalInstance.zIndex = -1;
          if (!this.projects[this.toolBar.selectedName]) {
            return;
          }
          this.loadProjectFromJson(this.projects[this.toolBar.selectedName]);
          this.reloadInsertComponent();
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

  LoadSolutionData() {
    this.basicService.querySolutionList().subscribe(
      (data: any) => {

        data.solution_list.forEach((item) => {
          let obj = { name: '', desc: '', file: '' };
          obj.name = item.name;
          obj.desc = item.desc;
          obj.file = item.file
          this.solutionList.push(obj)
        })

      },
      (error) => {
        return null;
      })
  }

  selectSolution(selectedName) {
    this.basicService.querySolution(selectedName).subscribe((data) => {
      const response = data;

      this.initCurrentProlect();
      this.name = selectedName;
      if (response.flow) {
        if (response.flow.desc) {
          this.desc = response.flow.desc;
        }
      }
      if (response.graph) {
        if (response.graph.graphconf) {
          this.dotSrc = response.graph.graphconf;
        }
      }

      this.dotSrcLastChangeTime = Date.now();
      if (response.driver) {
        this.skipDefault = response.driver['skip-default'];
        this.dirs = [];
        if (typeof (response.driver.dir) == 'string') {
          this.dirs.push(response.driver.dir);
        } else {
          response.driver.dir.forEach(item => {
            this.dirs.push(item)
          });
        }
      }
      this.saveCurrentProject();
      this.reloadInsertComponent();
      this.handleZoomResetButtonClick();
    }
    )
  }

  showSolutionDialog(content: TemplateRef<any>) {
    const results = this.dialogService.open({
      id: 'solutionDialog',
      width: '900px',
      title: this.i18n.getById('toolBar.solutionDialogButton'),
      showAnimate: false,
      contentTemplate: content,
      backdropCloseable: true,
      onClose: () => {

      },
      buttons: [{
        cssClass: 'danger',
        text: this.i18n.getById('modal.okButton'),
        disabled: false,
        handler: ($event: Event) => {

          results.modalInstance.hide();
          results.modalInstance.zIndex = -1;

          this.selectSolution(this.toolBar.selectedSolutionName);
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
