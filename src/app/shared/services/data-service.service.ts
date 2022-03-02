import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import units from './units.json';
import { BasicServiceService } from '@shared/services/basic-service.service';
import { ToastService } from 'ng-devui/toast';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  nodeShapeCategories: any = [];
  public currentPage: any = "";
  
  public defaultSolutionGraph = "mnist.toml";
  public commonFlowunitPath = "/usr/local/lib";
  public defaultPerfDir = '/tmp/modelbox/perf/';
  public defaultFormat = "graphviz";
  public defaultSrc: string = `digraph {
    node [shape=Mrecord];
  }`;

  public currentSolution = this.defaultSolutionGraph;
  public currentSolutionProject = {};

  constructor(private sanitized: DomSanitizer,
    private basicService: BasicServiceService,
    private toastService: ToastService) {
    this.nodeShapeCategories.length = 0;
  }

  // 使用 unit name 及 type获取 对应的 unit
  getUnit(name, type) {
    let unit;
    if (this.nodeShapeCategories.length === 0) {
      this.loadFlowUnit(null, []);
    }
    this.nodeShapeCategories.forEach(cat => {
      cat.children.forEach(it => {
        if (it.name === name) {
          unit = it;
          if (it.type !== type && it.types.indexOf(type) === -1) {
            this.toastService.open({
              value: [{ severity: 'warn', content: unit.name + "顶点类型错误。请选择带有GPU的设备。" }],
              life: 3000
            });
          }
        }
      });
    });
    return unit;
  }

  loadFlowUnit(skip, dirs) {
    if (skip === null) {
      skip = false;
    }

    if (skip === "") {
      skip = false;
    }
    let params = {
      "skip-default": skip,
      dir: dirs,
    }
    this.basicService.queryData(params).subscribe((data) => {
      let nodeShapeCategories = [];
      this.nodeShapeCategories = [];
      if (data.devices == null) {
        return;
      }
      data.flowunits.forEach(item => {
        const group = nodeShapeCategories.find(i => i.title === item.group);
        const unit = {
          ...item,
          title: item.name,
          active: nodeShapeCategories.length == 0 ? true : false,
          types: [
            ...new Set(
              data.flowunits.filter(u => u.name === item.name).map(i => i.type)
            ),
          ],
        };

        if (group) {
          group.children.push(unit);
        } else {
          nodeShapeCategories.push({
            title: item.group,
            collapsed: true,
            children: [unit],
          });
        }
      });
      this.nodeShapeCategories = nodeShapeCategories;
      this.nodeShapeCategories = this.nodeShapeCategories.map(
        item => {
          return {
            ...item,
            children: [...new Set(item.children.map(it => it.title))].map(it =>
              item.children.find(i => i.title === it)
            ),
          };
        }
      );
    })

    
  }

  nodeShapeCategoriesAdd(param) {
    this.nodeShapeCategories;
    const group = this.nodeShapeCategories.find(i => i.title === param.title);
    const unit = {
      name: param.flowunitName,
      descryption: param.desc,
      title: param.flowunitName,
      active: this.nodeShapeCategories.length == 0 ? true : false,
      type: param.deviceType,
      types: [param.deviceType],
      version: "1.0.0",
      virtual: false,
      inputports:param.portInfos.filter(x=>x.portType=="output"),
      outputports:param.portInfos.filter(x=>x.portType=="input")
    };
    if (group) {
       group.children.push(unit);
    } else {
      this.nodeShapeCategories.push({
        title: "Generic",
        collapsed: true,
        children: [unit],
      });
    }
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

  formLabel(data) {
    let parts = [];
    if (data.inputports && data.inputports.length > 0) {
      parts.push(
        '{' +
        data.inputports.map(item => `<${item.name}> ${item.name}`).join('|') +
        '}'
      );
    }
    parts.push('_NODE_NAME_');
    if (data.outputports && data.outputports.length > 0) {
      parts.push(
        '{' +
        data.outputports
          .map(item => `<${item.name}> ${item.name}`)
          .join('|') +
        '}'
      );
    }
    return '{' + parts.join('|') + '}';
  }
}
