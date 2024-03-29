import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BasicServiceService } from '@shared/services/basic-service.service';
import { ToastService } from 'ng-devui/toast';
import { I18nService } from '@core/i18n.service';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  nodeShapeCategories: any = [];
  public currentPage: any = "";

  public defaultFormat = "graphviz";
  public commonFlowunitPath = "/usr/local/lib";
  public defaultPerfDir = '/tmp/modelbox/perf/';
  public defaultFlowunitDir = "/usr/local/share/modelbox/solution/flowunit/";
  public defaultSearchPath = "";
  public defaultSrc: string = `digraph {
    node [shape=Mrecord];
  }`;
  public currentSolution;
  public currentSolutionProject = {};
  public flowunits = [];
  public transformedFlowunits = [];
  public currentSolutionList = [];
  warningMessage = false;
  public msgstack = [];
  public deviceTypes = [];
  data: any;
  currentUser = "root";
  refresh_timer: any;


  constructor(
    private basicService: BasicServiceService,
    private toastService: ToastService,
    private i18n: I18nService) {
    this.nodeShapeCategories.length = 0;
  }

  // sleep time expects milliseconds
  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  getCurrentPage() {
    return this.currentPage;
  }

  addGraphNameOnDotSrc(graphName) {
    let name = graphName.replace(/[\. -]/gi, '_');
    let dotSrc = this.defaultSrc.replace(/(\s*)(digraph|graph)\s(.*){/gi, '$1$2 ' + name + ' {');
    return dotSrc;
  }

  titleCase(str) {
    if (str) {
      let newStr = str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
      return newStr;
    }
    return str;
  }

  stopRefreshTimer() {
    clearInterval(this.refresh_timer);
  }

  transformFlowunit() {
    this.transformedFlowunits = [];
    this.flowunits.map(ele => {
      let obj = {
        description: "",
        group: "",
        name: "",
        version: "",
        type: "",
        inputports: [],
        outputports: [],
        advance: {
          deviceid: "",
          batchSize: "",
          queueSize: ""
        }
      };
      obj.description = ele.base.description;
      obj.group = this.titleCase(ele.base.group_type);
      if (!obj.group) {
        obj.group = "Generic";
      }
      obj.name = ele.base.name;
      obj.version = ele.base.version;
      obj.type = ele.base.device;
      for (let i in ele.input) {
        obj.inputports.push(ele.input[i]);
      }
      for (let i in ele.output) {
        obj.outputports.push(ele.output[i]);
      }
      this.transformedFlowunits.push(obj);
    });
    return this.transformedFlowunits;
  }

  compare(property) {
    return function (obj1, obj2) {
      var value1 = obj1[property];
      var value2 = obj2[property];
      let ans = value1.localeCompare(value2);
      return ans;     // 升序
    }
  }

  // 使用 unit name 及 type获取 对应的 unit
  getUnit(name, type) {
    let unit;
    this.nodeShapeCategories.forEach(cat => {
      cat.children.forEach(it => {
        if (it.name === name) {
          if (it.type === type) {
            unit = it;
          }
          if (it.type !== type && it.types.indexOf(type) === -1 && !this.warningMessage && !it.virtual) {
            if (unit) {
              this.toastService.open({
                value: [{ severity: 'warn', content: unit.name + this.i18n.getById("message.wrongFlowunitTypePleaseChooseGPUDevice") }],
                life: 3000,
                style: { top: '100px' }
              });
              this.warningMessage = true;
              this.sleep(3000).then(() => {
                this.warningMessage = false;
              });
            } else {
              this.toastService.open({
                value: [{ severity: 'warn', content: name + ":" + type + " not found!" }],
                life: 3000,
                style: { top: '100px' }
              });
              this.warningMessage = true;
              this.sleep(3000).then(() => {
                this.warningMessage = false;
              });
            }
          }
        }
      });
    });
    return unit;
  }

  getLabel(name, type, labelname) {
    let parts = [];
    let unit = this.getUnit(name, type);
    if (typeof unit === 'undefined') {
      return "";
    }

    if (unit.inputports && unit.inputports.length > 0) {
      parts.push(
        '{' +
        unit.inputports.map(item => `<${item.name}> ${item.name}`).join('|') +
        '}'
      );
    }
    parts.push(labelname);
    if (unit.outputports && unit.outputports.length > 0) {
      parts.push(
        '{' +
        unit.outputports
          .map(item => `<${item.name}> ${item.name}`)
          .join('|') +
        '}'
      );
    }
    return '{' + parts.join('|') + '}';
  }

  // 获取 port类型 input / output / main
  getPortType(unit, linkName): string {
    const [node, port] = linkName.split(':');
    if (!port) {
      return 'main';
    } else {
      if (unit && unit.inputports.find(it => it.name === port)) {
        return 'input';
      } else {
        return 'output';
      }
    }
  }

  loadProjectFlowunit(path) {
    this.basicService.openProject(path).subscribe(
      (data: any) => {
        if (data) {
          this.flowunits = data.flowunits;
          return this.flowunits;
        }
      },
      (err) => {
        return;
      }
    );
  }

  setBasicService(basicService) {
    this.basicService = basicService;
  }

  pathValidate(path) {

    if ((/^[a-z]:((\\|\/)[a-z0-9\s_@\-^!#$%&+={}\[\]]+)/i.test(path)) ||
      (/^([\\/][a-z0-9\s\-_\@\-\^!#$%&]*)+(\.[a-z][a-z0-9]+)?$/i.test(path))) {
      return true;
    }
    return false;
  }

  insertNodeType(graph) {
    let pos;
    let newGraph = graph;
    if (graph.indexOf("node [shape=Mrecord]") === -1) {
      pos = graph.indexOf("{") + 1;
      newGraph = graph.slice(0, pos) + "\n\tnode [shape=Mrecord]" + graph.slice(pos);
    }
    return newGraph;
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

  formatFileNameToId(fileName) {
    if (fileName) {
      if (fileName.indexOf(".toml") > -1) {
        return fileName.slice(0, fileName.length - ".toml".length);
      }
      return fileName;
    }
  }

  formatIdToFileName(fileName) {
    if (fileName) {
      if (fileName.indexOf(".toml") === -1) {
        return fileName + ".toml";
      }
      return fileName;
    }
  }

}
