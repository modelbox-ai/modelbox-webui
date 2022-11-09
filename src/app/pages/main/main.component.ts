import {
  Component,
  TemplateRef,
  ViewEncapsulation,
  ViewChild,
  SimpleChanges,
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
import { ToastService } from 'ng-devui/toast';
import { cloneDeep } from 'lodash';
import { HeaderMainComponent } from 'src/app/components/header-main/header-main.component';
import { GraphComponent } from 'src/app/components/graph/graph.component';
import { ModalVscodeComponent } from '../../components/modal-vscode/modal-vscode.component';
import { ModalGuideMainComponent } from 'src/app/components/modal-guide-main/modal-guide-main.component';
import { MessageService } from '@shared/services/msg-service.service';
import { GraphStatus } from '@shared/constants';
import { ManagementComponent } from 'src/app/components/management/management.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent {
  @ViewChild('splitV', { static: true }) splitV: SplitComponent;
  @ViewChild('splitH', { static: true }) splitH: SplitComponent;

  activeEditor: boolean = true;
  activeTaskLists: boolean = false;
  componentPanelEar: string = this.i18n.getById('panelEar.componentLabel');
  editToolPanelEar: string = this.i18n.getById('panelEar.editToolLabel');
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
  page = "main";
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
  centerSplitterSize = 90;
  holdOff = localStorage.getItem('holdOff') || 0.2;
  fontSize = localStorage.getItem('fontSize') || 12;
  tabSize = Number(localStorage.getItem('tabSize')) || 4;
  resetUndoAtNextTextChange: any;
  project: any = JSON.parse(localStorage.getItem('project')) || {};
  graphs: any = JSON.parse(localStorage.getItem('graphs')) || {};
  project_name: string = JSON.parse(localStorage.getItem('project')) ? this.project.name : "";
  project_desc: string = JSON.parse(localStorage.getItem('project')) ? this.project.project_desc : "";
  graphName: string;
  path: string = this.dataService.defaultSearchPath;
  desc: string;
  state: any;
  currentComponent: any;
  folderList: any = [];
  modelFlowunitPath = [];
  AttributePanel: AttributePanelComponent;
  createProjectDialogResults;
  @ViewChild('insertPanel', { static: true }) InsertPanels: InsertPanelsComponent;
  @ViewChild('attributePanel', { static: true }) attributePanel: AttributePanelComponent;
  @ViewChild('textEditor', { static: true }) editor: TextEditorComponent;
  @ViewChild('toolBar', { static: true }) toolBar: ToolBarComponent;
  @ViewChild('header', { static: true }) header: HeaderMainComponent;
  @ViewChild('graph', { static: true }) graph: GraphComponent;
  @ViewChild('modalGuideMain', { static: true }) modalGuideTemplate: TemplateRef<any>;
  @ViewChild('modalBat', { static: true }) modalBatTemplate: TemplateRef<any>;
  @ViewChild('customTemplate') customTemplate: TemplateRef<any>;

  handleNodeShapeClick = () => { };
  handleNodeShapeDragStart = () => { };
  handleNodeShapeDragEnd = () => { };
  handleZoomInButtonClick = () => { };
  handleZoomOutButtonClick = () => { };
  handleZoomFitButtonClick = () => { };
  handleZoomResetButtonClick = () => { };
  handleNodeAttributeChange = () => { };
  handleSwitchButtonClick = () => { };
  graphDesc: string;
  flowunitPath: any;
  projectPath: any;
  openProjectDialogResults: any;
  createFlowunitDialogResults: any;
  statusGraph = 0;

  currentGraph: any;
  msgs: Array<Object> = [];
  typeFlowunit: any;
  resultsOpenGuideMain: any;
  ipAddress: any;
  portAddress: any;

  constructor(private dialogService: DialogService,
    private i18n: I18nService,
    private basicService: BasicServiceService,
    private dataService: DataServiceService,
    private toastService: ToastService,
    private modalService: ModalService,
    private message: MessageService) {
    this.constructMainComponent();
  }

  constructMainComponent() {
    const current_project = JSON.parse(localStorage.getItem('project'));
    this.basicService.queryRootPath().subscribe((data) => {
      let path;
      this.dataService.currentUser = data['user'];
      if (data['user'] === "modelbox") {
        path = "/tmp";
      } else {
        path = data['home-dir']
      }
      this.path = path;
      this.dataService.defaultSearchPath = path;
      this.toolBar.openproject_path = path;
    });
    if (current_project) {
      this.loadProjectFromJson(current_project);
    } else {
      this.initCurrentProject();
    }
  }

  ngOnInit(): void {
    this.dataService.currentPage = "main";
    if (!JSON.parse(localStorage.getItem('project'))) {
      this.openGuideMain();
    }
    this.ipAddress = window.location.hostname;
    this.portAddress = "22";
    this.getGraphStatus(this.project.graph?.fileName);
    this.startTimerGetGraphFileName(this.project.rootpath, this.project.name, this.project.graph?.fileName);

  }

  startTimerGetGraphFileName(rootpath, name, fileName) {
    if (rootpath && name && fileName) {
      this.dataService.refresh_timer = setInterval(() => {
        this.getGraphFileTime(rootpath
          + "/"
          + name
          + "/src/graph/"
          + this.dataService.formatIdToFileName(fileName)
        );
      }, 10000);
    }
  }

  getGraphStatus(name) {
    this.message.currentMessage.subscribe(msg => {
      if (msg.length > 0) {
        msg.forEach(element => {
          if (this.dataService.formatFileNameToId(name) === element.job_id) {
            this.statusGraph = this.graphStatusparse(element.job_status);
          }
        });
      } else {
        this.updataStatusGraph(name);
      }
    });
  }

  updataStatusGraph(name) {
    this.basicService.getTaskLists().subscribe((data: any) => {
      if (data.job_list.length === 0) {
        this.statusGraph = 0;
        return;
      }
      for (let i of data.job_list) {
        let fileName = this.dataService.formatFileNameToId(name);
        if (i.job_id === fileName) {
          this.statusGraph = this.graphStatusparse(i.job_status);
          return;
        } else {
          this.statusGraph = 0;
        }
      }
    });
  }

  ngAfterViewInit() {
    this.splitH.dragProgress$.subscribe(x => {
      this.handleGrutterMove(x);
    });
    this.splitV.dragProgress$.subscribe(x => {
    });

  }

  private graphStatusparse(data) {
    switch (data) {
      case "CREATEING":
        return GraphStatus.RUNNING;
      case "FAILED":
        return GraphStatus.FAILED;
      default:
        return GraphStatus.STOP;
    }
    return data;
  }

  openGuideMain(dialogtype?: string) {
    this.resultsOpenGuideMain = this.dialogService.open({
      id: 'main-guide',
      title: this.i18n.getById("pleaseNewOrOpenProjectFirst"),
      contentTemplate: this.modalGuideTemplate,
      width: '400px',
      showAnimation: true,
      buttons: []
    });
    return this.resultsOpenGuideMain;
  }

  mainGuideCreateProject() {
    this.toolBar.showCreateProjectDialog(this.toolBar.createProjectTemplate);
    this.resultsOpenGuideMain.modalInstance.hide();
    this.resultsOpenGuideMain.modalInstance.zIndex = -1;
  }

  mainGuideOpenProject() {
    this.toolBar.showOpenProjectButtonDialog(this.toolBar.openProjectTemplate);
    this.resultsOpenGuideMain.modalInstance.hide();
    this.resultsOpenGuideMain.modalInstance.zIndex = -1;
  }

  updateProjectPath(e) {
    this.projectPath = e;
  }

  reloadInsertComponent(f = null) {
    if (typeof this.InsertPanels === 'undefined') {
      return
    }
    if (f === "update") {
      this.InsertPanels.loadFlowUnit(this.skipDefault, this.dirs, this.toolBar.openproject_path);
      return;
    }
    this.InsertPanels.loadFlowUnit(this.skipDefault, this.dirs, this.projectPath);
  }

  initCurrentProject() {
    localStorage.clear();
    this.graphName = this.createUntitledName(this.graphs); //graph
    this.project_desc = "";
    this.dotSrc = this.dataService.defaultSrc;
    this.dotSrcLastChangeTime = Date.now();
    this.svgString = '';
    this.graphDesc = '';
    this.skipDefault = false;
    this.dirs = [];
    this.settingPerfEnable = false;
    this.settingPerfTraceEnable = false;
    this.settingPerfSessionEnable = false;
    this.settingPerfDir = this.dataService.defaultPerfDir + "/" + this.graphName;
    if (this.toolBar) {
      this.toolBar.initFormData();
    }
    this.reloadInsertComponent();
    this.statusGraph = 0;
  }

  loadProjectFromJson(project) {
    if (project) {
      this.project_name = project.name;
      this.project_desc = project.project_desc;
      this.path = project.rootpath;

      this.dotSrc = project.graph.dotSrc;
      this.graphName = this.getGraphNameFromGraph(this.dotSrc);
      if (typeof this.dotSrc === 'undefined') {
        this.dotSrc = this.dataService.defaultSrc;
      }

      this.dotSrcLastChangeTime = project.dotSrcLastChangeTime;
      this.svgString = project.svgString;
      this.skipDefault = project.skipDefault;
      if (typeof this.skipDefault === 'undefined') {
        this.skipDefault = false;
      }
      this.dirs = project.graph.dirs;
      this.settingPerfEnable = project.graph.settingPerfEnable;
      this.settingPerfTraceEnable = project.graph.settingPerfTraceEnable;
      this.settingPerfSessionEnable = project.graph.settingPerfSessionEnable;
      this.settingPerfDir = project.graph.settingPerfDir;
      this.projectPath = project.flowunit['project-path'];
      this.reloadInsertComponent();
      this.basicService.openProject(this.path + "/" + this.project_name).subscribe(
        data => {
          let src = data.graphs.find(ele => ele.name === project.graph.fileName);
          src ? localStorage.setItem("normGraph", src) : localStorage.setItem("normGraph", this.dotSrc);
          this.getGraphStatus(this.project.graph.fileName);
          this.getGraphFileTime(data.project_path + "/src/graph/" + this.dataService.formatIdToFileName(this.project.graph.fileName));
        }
      );
    }
  }

  getGraphFileTime(graphPath) {
    this.basicService.queryGraphFile(graphPath).subscribe(
      data => {
        if (data?.modify_time) {
          let oldModTime = localStorage.getItem(graphPath);
          if (oldModTime) {
            if (oldModTime < data?.modify_time) {
              //提示要不要覆盖?
              if (!document.querySelector("#backend-changed")) {
                const results = this.dialogService.open({
                  id: 'backend-changed',
                  width: '346px',
                  maxHeight: '600px',
                  title: this.i18n.getById("notice"),
                  content: this.i18n.getById("backendGraphFileChanged"),
                  backdropCloseable: true,
                  dialogtype: 'warning',
                  buttons: [
                    {
                      cssClass: 'primary',
                      text: this.i18n.getById("toolBar.saveAsButton"),
                      handler: ($event: Event) => {
                        results.modalInstance.hide();
                        results.modalInstance.zIndex = -1;
                        this.toolBar.saveAllProject();
                        localStorage.setItem(graphPath, data?.modify_time);
                      },
                    },
                    {
                      cssClass: 'primary',
                      text: this.i18n.getById("toolBar.sycnGraphButton"),
                      handler: ($event: Event) => {
                        results.modalInstance.hide();
                        results.modalInstance.zIndex = -1;
                        this.toolBar.sycnGraph();
                        localStorage.setItem(graphPath, data?.modify_time);
                      },
                    },
                  ],
                });
              }
            }
          } else {
            localStorage.setItem(graphPath, data?.modify_time);
          }
        } else {
          this.msgs = [
            { severity: 'error', content: graphPath + "is not found!" }
          ];
        }
      });
  }

  getProjectJson() {
    let path = this.dirs;
    const projectdata = {
      name: this.toolBar.formDataCreateProject.name,
      rootpath: this.toolBar.formDataCreateProject.rootpath,
      graph: {
        graphName: this.toolBar.formData.graphName,
        graphDesc: this.toolBar.formData.graphDesc,
        dotSrc: this.dotSrc,
        dotSrcLastChangeTime: this.dotSrcLastChangeTime,
        svgString: this.getSvgString(),
        skipDefault: this.skipDefault,
        dirs: path,
        settingPerfEnable: this.toolBar.formData.perfEnable,
        settingPerfTraceEnable: this.toolBar.formData.perfTraceEnable,
        settingPerfSessionEnable: this.toolBar.formData.perfSessionEnable,
        settingPerfDir: this.toolBar.formData.perfPath,
        flowunitDebugPath: this.toolBar.formData.flowunitDebugPath,
        flowunitReleasePath: this.toolBar.formData.flowunitReleasePath,
        fileName: this.toolBar.formData.fileName
      },

      flowunit: this.toolBar.formDataCreateFlowunit
    }

    return projectdata;
  }

  removeDotSrcLabel() {
    if (this.graph.dotGraph !== undefined) {
      const nodes = { ...this.graph.dotGraph.nodes };
      const edges = { ...this.graph.dotGraph.edges };
      let dotGraph = cloneDeep(this.graph.dotGraph);
      for (let node in nodes) {
        let attr = nodes[node]['attributes'];
        let flowunit = attr['flowunit'];

        if (flowunit) {
          delete attr["label"];
        }
        dotGraph.updateNode(node, attr);
        dotGraph.reparse();
      }
      this.toolBar.dotSrcWithoutLabel = dotGraph.dotSrc;
    }
  }

  createProject(param) {
    this.saveCurrentProject();
    param["rootpath"] = this.toolBar.openproject_path;
    if (!this.dataService.pathValidate(param.rootpath)) {
      return;
    }
    localStorage.clear();
    sessionStorage.clear();
    // stop running service
    this.statusGraph = 0;
    this.basicService.getTaskLists().subscribe((data: any) => {
      if (data.job_list) {
        data.job_list.map(ele => {
          this.basicService.deleteTask(ele.job_id).subscribe((res: any) => {
            location.reload();
          });
        });
      }
    });
    this.basicService.createProject(param).subscribe((data: any) => {
      if (data.status === 201) {
        //关闭项目
        this.initCurrentProject();
        this.project_name = param.name;
        //after created successfully
        localStorage.removeItem("project");
        this.dotSrc = this.dataService.defaultSrc;

        localStorage.setItem("normGraph", this.dotSrc);
        this.createProjectDialogResults.modalInstance.hide();
        this.msgs = [
          { severity: 'success', content: data.body.msg }
        ];
        let openProjectPath = param.rootpath + "/" + param.name;
        this.loadProject(openProjectPath);

        this.createProjectDialogResults.modalInstance.hide();
        this.createProjectDialogResults.modalInstance.zIndex = -1;
        // 弹出提示框，要求在vscode中开发
        this.openDialog();
        this.dataService.stopRefreshTimer();
        this.startTimerGetGraphFileName(param.rootpath, param.name, this.dataService.formatIdToFileName(param.name));
        return;
      }
    }, error => {
      this.msgs = [
        { life: 30000, severity: 'error', summary: 'ERROR', content: error.error.msg }
      ];
    });
  }

  openDialog() {
    const results = this.modalService.open({
      id: 'modal-no-btn',
      width: '400px',
      backdropCloseable: true,
      component: ModalVscodeComponent,
      onClose: () => {
      },
      data: {
        content: this.toolBar.formDataCreateProject.rootpath + "/" + this.toolBar.formDataCreateProject.name,
        cancelBtnText: this.i18n.getById('modal.okButton'),
        onClose: (event) => {
          results.modalInstance.hide();
        },
        onDownload: (event) => {
          if (event.target.className !== "icon-close") {
            this.openBatDialog();
          }
        },
      },
    });
  }

  openBatDialog() {
    const results = this.dialogService.open({
      id: 'dialog-bat',
      width: '346px',
      title: this.i18n.getById('message.pleaseInputIpAddress'),
      contentTemplate: this.modalBatTemplate,
      backdropCloseable: true,
      buttons: [
        {
          cssClass: 'primary',
          text: this.i18n.getById('modal.okButton'),
          handler: ($event: Event) => {
            let host = this.ipAddress;
            if (this.portAddress) {
              host += "-" + this.portAddress;
            }
            let text = 'REM vscode and remote-ssh plugin both are necessary. \r\n\
REM If you run modelbox inside a container, you need to change the mapped port number. \r\n\
REM For example: code --remote=ssh-remote+xx.xx.xx.xx-xxxx /home/modelbox_project\r\n\
@ECHO off\r\n\
FINDSTR "' + host + '" "%HOMEDRIVE%%HOMEPATH%\\.ssh\\config">nul\r\n\
IF ERRORLEVEL 1 (\r\n\
ECHO.>>"%HOMEDRIVE%%HOMEPATH%\\.ssh\\config"\r\n\
ECHO Host '+ host + '>>"%HOMEDRIVE%%HOMEPATH%\\.ssh\\config"\r\n\
ECHO HostName '+ this.ipAddress + '>>"%HOMEDRIVE%%HOMEPATH%\\.ssh\\config"\r\n\
ECHO User '+ this.dataService.currentUser + '>>"%HOMEDRIVE%%HOMEPATH%\\.ssh\\config"\r\n\
ECHO Port '+ this.portAddress + '>>"%HOMEDRIVE%%HOMEPATH%\\.ssh\\config"\r\n\
)\r\n';
            text += 'code --remote=ssh-remote+'
              + host
              + " "
              + this.toolBar.formDataCreateProject.rootpath
              + "/"
              + this.toolBar.formDataCreateProject.name
              + "\r\n";
            text += 'IF ERRORLEVEL 9009 (\r\n\
  REM 9009 vscode cannot be found\r\n\
  REM Download vscode installer\r\n\
  IF %PROCESSOR_ARCHITECTURE%==AMD64 (\r\n\
    ECHO Downloading installer from https://code.visualstudio.com/docs/?dv=win64user\r\n\
    START https://code.visualstudio.com/docs/?dv=win64user\r\n\
  )\r\n\
  IF %PROCESSOR_ARCHITECTURE%==x86 (\r\n\
    ECHO Downloading installer from https://code.visualstudio.com/docs/?dv=win32user\r\n\
    START https://code.visualstudio.com/docs/?dv=win32user\r\n\
  )\r\n'

            this.downloadTxt(
              text +
              " " +
              this.toolBar.formDataCreateProject.rootpath +
              "/" +
              this.toolBar.formDataCreateProject.name, this.i18n.getById('openvscode.bat'));
            results.modalInstance.hide();
            results.modalInstance.zIndex = -1;
          },
        },
        {
          cssClass: 'primary',
          text: this.i18n.getById('modal.cancelButton'),
          handler: ($event: Event) => {
            results.modalInstance.hide();
            results.modalInstance.zIndex = -1;
          },
        }
      ],
    });
  }

  downloadTxt(text, fileName) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    element.click();
  }

  downloadGraph() {
    this.handleZoomFitButtonClick();
    let svgs = document.getElementsByTagName("svg");
    let g = document.getElementById("graph0");
    let width = g.getBoundingClientRect().width;


    let svg = svgs[svgs.length - 1];
    let xforms = g.getAttribute('transform');
    let parts = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(xforms);
    let firstX = parts[1];
    let firstY = parts[2];
    let scaleIndex = xforms.indexOf("scale");
    let scale = xforms.slice(scaleIndex, xforms.length);

    // Setting if left side the graph 
    // ex: g.setAttribute('transform', 'translate(10, ' + firstY + ')' + scale);
    let result = svg.outerHTML;
    this.downloadImg(result, "graphviz.svg");
  }

  downloadImg(result, fileName) {
    let parser = new DOMParser();
    let svg = parser.parseFromString(result, "image/svg+xml");
    let serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    let element = document.createElement('a');
    element.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    element.click();
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

  loadProject(openProjectPath) {
    this.basicService.openProject(openProjectPath).subscribe(
      (data: any) => {
        this.toolBar.formDataCreateProject.name = data.project_name;
        this.toolBar.formDataCreateProject.rootpath = data.project_path.substring(0, data.project_path.lastIndexOf("/"));
        this.toolBar.openproject_path = this.toolBar.formDataCreateProject.rootpath;
        if (data.graphs?.length > 1) {
          this.currentGraph = data.graphs[data.graphs.length - 2];
        } else if (data.graphs?.length === 1) {
          this.currentGraph = data.graphs[0];
        } else {
          this.currentGraph = null;
        }
        if (data.graphs && this.currentGraph != null) {
          if (this.currentGraph.graph.graphconf) {
            this.dotSrc = this.dataService.insertNodeType(this.currentGraph.graph.graphconf);
            this.toolBar.formData.graphName = this.getGraphNameFromGraph(this.currentGraph.graph.graphconf);
            this.toolBar.formData.graphDesc = this.currentGraph.flow?.desc;
            this.toolBar.formData.fileName = this.currentGraph.name;
            this.toolBar.formData.skipDefault = false;
            if (this.currentGraph.profile) {
              this.toolBar.formData.perfEnable = this.currentGraph.profile.profile;
              this.toolBar.formData.perfTraceEnable = this.currentGraph.profile.trace;
            }

            this.toolBar.formData.flowunitReleasePath = this.currentGraph.driver.dir;
            this.toolBar.formData.flowunitDebugPath = this.toolBar.formData.flowunitReleasePath;
            if (this.toolBar.formData.flowunitReleasePath.indexOf(openProjectPath + "/src/flowunit") === -1) {
              this.toolBar.formData.flowunitDebugPath.push(openProjectPath + "/src/flowunit");
            }

            this.dirs = this.toolBar.formData.flowunitDebugPath;
            this.project_name = data.project_name;
          } else {
            this.toolBar.initFormData();
            this.dotSrc = this.dataService.defaultSrc;
          }
        } else {
          this.toolBar.initFormData();
          this.dotSrc = this.dataService.defaultSrc;
        }
        this.saveCurrentProject();
        this.reloadInsertComponent();

      }, error => {
        this.msgs = [
          { life: 30000, severity: 'error', summary: 'ERROR', content: error.error.msg }
        ];
      });

  }

  searchTypeByNameOfCategories(name) {
    let res;
    let that = this;
    this.InsertPanels.nodeShapeCategories.forEach(item => {
      item.children.forEach(element => {
        if (element['name'] === name) {

          res = element['type'];
          that.graph.typeFlowunit = res;
          return res;
        }
      });
    });
    return res;
  }

  saveCurrentProject() {
    this.dataService.setPersistentState(
      {
        project: this.getProjectJson()
      });
  }

  saveGraphs() {
    this.saveCurrentProject();
    this.dataService.setPersistentState({
      graphs: {
        ...this.graphs,
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
      if (this.dotSrc) {
        error.numLines = this.dotSrc.split('\n').length;
      }
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

  dotSrcUpdate(e) {
    this.dotSrc = e;
  }

  updateIsOpen(e) {
    this.toolBar.closeInput();
  }

  setEditorMarkers(components) {
    let marks = [];
    for (const component of components) {
      if (component.locations) {
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

    }
    this.editor.handleMarkers(marks)
  }

  handleGraphComponentSelect = components => {
    this.selectedGraphComponents = components;
    this.setEditorMarkers(components);

    if (components.length === 1 && components[0].name.indexOf('->') === -1) {
      this.currentComponent = components[0];
      if (this.currentComponent.attributes) {
        this.currentComponent.attributes = Object.keys(
          this.currentComponent.attributes
        ).map(k => {
          return {
            key: k,
            value: this.currentComponent.attributes[k],
          };
        });
      }
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

  createUntitledName = (graphs, currentName?) => {
    const baseName = 'Untitled';
    let newName = baseName;
    while (graphs[newName] || newName === currentName) {
      newName = baseName + ' ' + (Number(newName.replace(baseName, '')) + 1);
    }
    return newName;
  };


  handleTextChange = (text, undoRedoState) => {
    this.isSaved = false;
    let normGraph = localStorage.getItem("normGraph");
    if (this.dotSrc !== text) {
      localStorage.setItem("isModifying", "1");
      this.dotSrc = text;
    }
    if (this.dotSrc === normGraph) {
      localStorage.setItem("isModifying", "0");
    }
    this.dotSrcLastChangeTime = Date.now();

    if (this.project && this.project.graph) {
      this.graphName = this.getGraphNameFromGraph(text);
      this.toolBar.formData.graphName = this.graphName;
    }

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
    this.dataService.setPersistentState({
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
            this.initCurrentProject();
            this.resetUndoAtNextTextChange = true;
            setTimeout(() => {
              this.handleZoomResetButtonClick();
            }, 1000);
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

    this.resetUndoAtNextTextChange = true;
    this.handleZoomResetButtonClick();
  };

  renameGraphSrc(newName) {
    let name = newName.replace(/[\. -]/gi, '_');
    this.dotSrc = this.dotSrc.replace(/(\s*)(digraph|graph)\s(.*){/gi, '$1$2 ' + name + ' {');
  }

  saveSettingOnNewGraph(obj) {
    this.renameGraphSrc(obj.graphName);
  }

  handleSaveAsToBrowser(newName, newDotSrc = '', rename = false) {
    if (newName === null) {
      return;
    }

    const currentName = this.graphName;
    if (rename) {
      delete this.graphs[currentName];
    }


    if (this.settingPerfDir === this.dataService.defaultPerfDir + "/" + this.graphName) {
      this.settingPerfDir = this.dataService.defaultPerfDir + "/" + newName;
    }
    this.graphName = newName;
    this.dotSrc = newDotSrc ? newDotSrc : newName ? this.dotSrc : '',
      this.dotSrcLastChangeTime = newDotSrc
        ? Date.now()
        : this.dotSrcLastChangeTime;
    this.saveCurrentProject();
    this.graphs[newName] = this.getProjectJson();
    this.saveGraphs();
    this.isSaved = true;
    this.renameGraphSrc(this.graphName);


  }

  getToolBarGraphsChange(e) {
    this.graphs = e
  }

  handleRedoButtonClick = () => {
    this.redo();
  };

  handleUndoButtonClick = () => {
    this.undo();
  };

  getSvgString() {
    const svg = this.getSvg();
    const serializer = new XMLSerializer();
    return svg ? serializer.serializeToString(svg) : this.svgString;
  }

  saveSetting(context: any) {
    let newName = context.graphName;
    this.graphName = newName;
    this.desc = context.graphDesc;
    let rankdir = context.radioValue;
    this.skipDefault = context.skipDefault;
    this.dirs = context.flowunitDebugPath;
    this.renameGraphSrc(newName);
    this.settingPerfEnable = context.perfEnable;
    this.settingPerfTraceEnable = context.perfTraceEnable;
    this.settingPerfSessionEnable = context.perfSessionEnable;

    if (this.settingPerfDir === this.dataService.defaultPerfDir + "/" + this.graphName) {
      this.settingPerfDir = this.dataService.defaultPerfDir + "/" + newName;
    } else {
      this.settingPerfDir = context.perfPath;
    }

    this.saveCurrentProject();
    this.reloadInsertComponent();
  }

  refreshFlowunit(e) {
    this.saveSetting(this.toolBar.formData);
  }

  showCreateProjectDialog(content: TemplateRef<any>) {
    this.basicService.queryRootPath().subscribe((data) => {
      let path;
      if (data['user'] === "modelbox") {
        path = "/tmp";
      } else {
        path = data['home-dir']
      }
      this.path = path;
      this.dataService.defaultSearchPath = path;
      this.toolBar.openproject_path = path;
      this.createProjectDialogResults = this.dialogService.open({
        id: 'createProject',
        width: '700px',
        title: this.i18n.getById('toolBar.newButton'),
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
            this.createProject(this.toolBar.formDataCreateProject);
          },
        },
        {
          id: 'save-as-cancel',
          cssClass: 'common',
          text: this.i18n.getById('modal.cancelButton'),
          handler: ($event: Event) => {
            this.createProjectDialogResults.modalInstance.hide();
            this.createProjectDialogResults.modalInstance.zIndex = -1;
          },
        },],
      });
    });

  }

  showOpenProjectButtonDialog(content: TemplateRef<any>) {
    this.toolBar.searchDirectory(this.toolBar.openproject_path);
    this.openProjectDialogResults = this.dialogService.open({
      id: 'openProject',
      width: '700px',
      title: this.i18n.getById('toolBar.openProjectButton'),
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
          localStorage.clear();
          sessionStorage.clear();
          // stop running service
          this.basicService.getTaskLists().subscribe((data: any) => {
            if (data.job_list) {
              data.job_list.map(ele => {
                this.basicService.deleteTask(ele.job_id).subscribe((res: any) => {
                  location.reload();
                });
              });
            }
          });
          this.toolBar.openProject(this.openProjectDialogResults);
        },
      },
      {
        id: 'save-as-cancel',
        cssClass: 'common',
        text: this.i18n.getById('modal.cancelButton'),
        handler: ($event: Event) => {
          this.openProjectDialogResults.modalInstance.hide();
          this.openProjectDialogResults.modalInstance.zIndex = -1;
        },
      },],
    });
  }

  showCreateFlowunitDialog(content: TemplateRef<any>) {
    this.transformNodeShapreCategories();
    this.createFlowunitDialogResults = this.dialogService.open({
      id: 'createFlowunit',
      width: '700px',
      title: this.i18n.getById('toolBar.newFlowunitButton'),
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

          if (!this.toolBar.createFlowunit(this.createFlowunitDialogResults)) {
            return;
          }
          //保存至本地
        },
      },
      {
        id: 'save-as-cancel',
        cssClass: 'common',
        text: this.i18n.getById('modal.cancelButton'),
        handler: ($event: Event) => {
          this.createFlowunitDialogResults.modalInstance.hide();
          this.createFlowunitDialogResults.modalInstance.zIndex = -1;
        },
      },],
    });
  }

  transformNodeShapreCategories() {
    this.toolBar.options = [];
    this.InsertPanels.nodeShapeCategories.forEach(
      element => {
        let obj = {};
        obj['label'] = element.title;
        obj['value'] = element.title;
        obj['icon'] = 'icon-folder';
        obj['children'] = [];
        element.children.forEach(ele => {
          let cld = {};
          cld['label'] = ele.title;
          cld['value'] = ele;
          cld['isLeaf'] = true;
          obj['children'].push(cld);
        });
        this.toolBar.options.push(obj);
      }
    )
  }

  updateProject(e) {
    this.loadProject(e);
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

          let flowScanPath = document.getElementById("flowScanPath");
          this.toolBar.formData.flowunitDebugPath = flowScanPath['value'].split(/[\s,;]+/g);
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

  showGraphSelectDialog(content: TemplateRef<any>) {
    const current_project = JSON.parse(localStorage.getItem('project'));
    this.basicService.openProject(current_project.flowunit['project-path']).subscribe(
      (data: any) => {
        this.toolBar.graphList = data.graphs;
        this.toolBar.createGraphSelectTableDataForDisplay();
        const results = this.dialogService.open({
          id: 'graphSelect',
          width: '1000px',
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
              let chosenGraph = this.toolBar.graphSelectTableDataForDisplay.filter(x => x.checked === true);
              this.dotSrc = chosenGraph[0]?.dotSrc;
              this.toolBar.formData.graphDesc = chosenGraph[0]?.desc;
              this.toolBar.formData.graphName = chosenGraph[0]?.name;
              let path = chosenGraph[0]?.graphPath.split('/');
              this.toolBar.formData.fileName = path[path.length - 1];
              this.saveCurrentProject();
              this.getGraphStatus(this.toolBar.formData.fileName);
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
      });

  }

  updateConfig(e) {
    this.currentComponent = e;
  }

  selectSolution(selectedName) {
    this.basicService.querySolution(selectedName).subscribe((data) => {
      const response = data;
      this.initCurrentProject();
      this.graphName = selectedName;
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
        this.modelFlowunitPath = response.driver.dir;
        this.skipDefault = response.driver['skip-default'];
        this.dirs = [];
        let path = this.toolBar.formDataCreateProject.rootpath + "/" + this.toolBar.formDataCreateProject.name + "/src/flowunit";
        this.dirs.push(path);
      }
      this.saveCurrentProject();
      this.reloadInsertComponent();
      this.handleZoomResetButtonClick();
    }
    )
  }

  updateDir(e) {
    this.dirs = e;
    this.reloadInsertComponent("update");
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

  updateDeviceType(e) {
    this.toolBar.optionsdevice = e;
    if (e.indexOf("ascend") > -1) {
      this.toolBar.currentDevice = "ascend";
      this.toolBar.placeholderModel = "model.om";
    }

    if (e.indexOf("cuda") > -1) {
      this.toolBar.currentDevice = "cuda";
      this.toolBar.placeholderModel = "model.pb";
    }

  }

  handleRunButtonClick = (graphName) => {
    //saveToBrowser
    let isModifying = localStorage.getItem("isModifying");
    //if user is modifying the graph
    if (isModifying === "1") {
      this.toolBar.isModifyingDecorater(this.handleRun, graphName, this);
    } else {
      this.handleRun(graphName);
    }
  }

  handleRun = (graphName) => {
    if (!graphName && this.project && this.project.graph) {
      graphName = this.getGraphNameFromGraph(this.project.graph.dotSrc);
    }
    this.graphs = {};
    if (graphName) {
      this.saveCurrentProject();
      this.project = JSON.parse(localStorage.getItem('project'));

      this.project.graph.graphName = graphName;
      this.graphs[this.project.graph.graphName] = this.project;
      this.saveGraphs();
      //run
      if (Array.isArray(this.project.graph.dirs)) {
        let str = "";
        this.project.graph.dirs.forEach(element => {
          str += element + "\n";
        });
        this.project.graph.dirs = str.slice(0, str.length - 2);
      }
      this.project.graph.dirs = this.project.graph.dirs.split("\n");
      let option = this.createOptionFromProject(this.project);

      this.basicService.createTask(option)
        .subscribe(async (data: any) => {
          //提示任务运行状态
          this.msgs = [
            { severity: 'success', summary: "Success", content: this.i18n.getById('message.checkInTaskPage') }
          ];
          this.statusGraph = 1;

          await new Promise(r => setTimeout(r, 2000));
          this.header.goManagement();
        }, error => {
          if (error.error != null) {
            this.msgs = [
              {
                life: 30000,
                severity: 'error',
                summary: this.i18n.getById("errorMessage") + error.error.error_code,
                content: this.customTemplate,
                errorCode: error.error.error_code,
                errorMsg: error.error.error_msg,
              },
            ];
            this.statusGraph = 2;
          }
        }
        );
    } else {
      if (!this.graphName) {
        this.msgs = [
          { severity: 'warn', summary: "", content: this.i18n.getById('message.graphNameCannotBeNull') }
        ];
        return;
      }
      this.msgs = [
        { severity: 'info', summary: "Info", content: this.i18n.getById('message.saveYourProjectFirst') }
      ];
      //open graph saving
      this.toolBar.showSaveAsDialog();
    }
  }

  handleStopButtonClick = (graphName) => {
    //saveToBrowser
    if (!graphName && this.project && this.project.graph) {
      graphName = this.getGraphNameFromGraph(this.project.graph.dotSrc);
    }
    this.basicService.getTaskLists().subscribe((data: any) => {
      for (let i of data.job_list) {
        if (graphName === i.job_id) {
          this.basicService.deleteTask(i.job_id).subscribe(data => {
            this.msgs = [
              { severity: 'success', content: this.i18n.getById('management.taskHasBeenDeletedSuccessfully') }
            ];

            this.statusGraph = 0;
          });
        }
      }
    });
  }

  handleRestartButtonClick = (graphName) => {
    //saveToBrowser
    if (!graphName && this.project && this.project.graph) {
      graphName = this.getGraphNameFromGraph(this.project.graph.dotSrc);
    }

    this.basicService.getTaskLists().subscribe((data: any) => {
      for (let i of data.job_list) {
        if (this.dataService.formatFileNameToId(this.project.graph.fileName)
          === this.dataService.formatFileNameToId(i.job_id)) {
          this.basicService.deleteTask(i.job_id).subscribe(data => {
            this.msgs = [
              { severity: 'success', content: this.i18n.getById('management.taskHasBeenDeletedSuccessfully') }
            ];

            this.handleRunButtonClick(graphName);
          });
        }
      }
    });

    this.getGraphStatus(this.project.graph.fileName);
  }

  createOptionFromProject = (item) => {
    let params = {};
    let job_id = this.dataService.formatFileNameToId(item.graph.fileName);
    params = {
      job_id: job_id ? job_id : item.graph.graphName,
      graph_name: this.handleGraphName(item.graph.graphName),
      graph: {
        flow: {
          desc: item.graph.graphDesc,
        },
        driver: {
          "skip-default": item.skipDefault,
          dir: item.graph.flowunitDebugPath,
        },
        profile: {
          profile: item.graph.settingPerfEnable,
          trace: item.graph.settingPerfTraceEnable,
          session: item.graph.settingPerfSessionEnable,
          dir: item.graph.settingPerfDir,
        },
        graph: {
          graphconf: item.graph.dotSrc,
          format: "graphviz",
        },
      }
    }

    params["graph_name"] = params["job_id"];
    params["job_graph"] = params["graph"];
    return params;
  }

  handleGraphName(name) {
    if (name.indexOf(".toml") == -1) {
      return name + ".toml";
    }
    return name;
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

  setStatusGraph(value) {
    this.statusGraph = value;
  }
}
