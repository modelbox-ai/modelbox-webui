import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import units from './units.json';
import { BasicServiceService } from '@shared/services/basic-service.service';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  nodeShapeCategories: any = [];
  constructor(private sanitized: DomSanitizer,
    private basicService: BasicServiceService) {
    this.nodeShapeCategories.length = 0;
  }

  // 使用 unit name 及 type获取 对应的 unit
  getUnit(name, type) {
    let unit;
    
    this.nodeShapeCategories.forEach(cat => {
      cat.children.forEach(it => {
        if (it.name === name && it.type === type) {
          unit = it;
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
