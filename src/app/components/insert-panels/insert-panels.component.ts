/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataServiceService } from '@shared/services/data-service.service';
import { BasicServiceService } from '@shared/services/basic-service.service';
import { I18nService } from '@core/i18n.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare const require: any

@Component({
  selector: 'app-insert-panels',
  templateUrl: './insert-panels.component.html',
  styleUrls: ['./insert-panels.component.less'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .my-custom-class .tooltip-inner {
      background-color: #333854;
      font-size: 75%;
      max-width: 280px;
      margin: 20px;
      padding: 8px;
    }
  `]
})
@Injectable({
  providedIn: 'root',
})
export class InsertPanelsComponent implements OnInit {
  @Input() onNodeShapeClick: any;
  @Input() onNodeShapeDragStart: any;
  @Input() onNodeShapeDragEnd: any;
  @Input() onClick: any;
  @Input() regFlowUnitPanel: any;
  @Input() dirs: any;
  @Input() projectPath: any;
  @Output() refreshEmmiter = new EventEmitter();
  imgSvg = require("../../../assets/img.svg");
  videoSvg = require("../../../assets/video.svg");
  commonSvg = require("../../../assets/common.svg");
  inputSvg = require("../../../assets/input.svg");
  outputSvg = require("../../../assets/output.svg");
  headClass: string = 'headClass';
  bodyClass: string = 'bodyClass';
  tipName: string = this.i18n.getById('insertPanels.tip.name');
  tipVersion: string = this.i18n.getById('insertPanels.tip.version');
  tipTopType: string = this.i18n.getById('insertPanels.tip.topType');
  tipDescription: string = this.i18n.getById('insertPanels.tip.description');
  tipIsVirtualmodel: string = this.i18n.getById('insertPanels.tip.isVirtualmodel');
  tipYes: string = this.i18n.getById('insertPanels.tip.yes');
  tipNo: string = this.i18n.getById('insertPanels.tip.no');
  dotSrcLastChangeTime: any = Date.now();
  res: any;
  autoOpenActiveMenu = false;

  classes = {
    columns: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    column: {
      flexBasis: '25%',
      flexGrow: '1',
      flexShrink: '0',
      textAlign: 'start',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'left',
      position: 'relative',
      marginTop: '10px',
      height: '40px',
      color: '#575D6C',
    }
  };

  trustHtml = this.sanitized.bypassSecurityTrustHtml;
  nodeShapeCategories: Array<any> = [];
  flowunits: any;
  transformedFlowunits: Array<any> = [];
  constructor(
    private sanitized: DomSanitizer,
    private dataService: DataServiceService,
    private basicService: BasicServiceService,
    private i18n: I18nService,
    private http: HttpClient,
  ) { }

  toggleTip(tooltip, context: any) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      context = this.handleTipText(context);
      tooltip.open({ context });
    }
  }

  handleTipText(context) {
    let reg = /(?<=@Brief:)[\s\S]*?(?=@Port)/;
    let res = context.descryption.match(reg);
    if (res !== null) {
      context.descryption = res[0].trim();
    }

    return context;
  }

  public isFlowUnitExist(name, type) {
    if (this.dataService.getUnit(name, type)) {
      return true;
    }
    return false;
  }

  loadProjectFlowunit(path) {
    this.basicService.openProject(path).subscribe(
      (data: any) => {
        if (data) {
          this.flowunits = data.flowunits;
        }
      },
      (err) => {
        return;
      }
    );
  }

  titleCase(str) {
    let newStr = str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
    return newStr;
  }

  transformFlowunit() {
    this.transformedFlowunits = [];
    this.flowunits.map(ele => {
      let obj = {
        descryption: "",
        group: "",
        name: "",
        version: "",
        type: "",
        inputports: [],
        outputports: []
      };
      obj.descryption = ele.base.description;
      obj.group = this.titleCase(ele.base.group_type);
      obj.name = ele.base.name;
      obj.version = ele.base.version;
      obj.type = ele.base.type;
      for (let i in ele.input) {
        obj.inputports.push(ele.input[i]);
      }
      for (let i in ele.output) {
        obj.outputports.push(ele.output[i]);
      }
      this.transformedFlowunits.push(obj);
    })
  }

  public loadFlowUnit(skip, dirs, path) {
    if (skip === null) {
      skip = false;
    }

    if (skip === "") {
      skip = false;
    }

    let type = typeof (dirs);
    if (type === "string") {
      dirs = dirs.replace(/\s\s*$/gm, "").split("\n");
    }
    let params = {
      "skip-default": skip,
      dir: dirs,
    }
    if (path != null) {
      this.loadProjectFlowunit(path);
    }
    this.basicService.queryData(params).subscribe((data) => {
      this.nodeShapeCategories = [];
      this.dataService.nodeShapeCategories = [];
      let index = [];
      if (data.devices == null) {
        return;
      }
      if (this.flowunits && this.flowunits.length > 0) {
        this.transformFlowunit();
        
        for (let ele in this.transformedFlowunits) {
          for (let ele2 of data.flowunits) {
            if (this.transformedFlowunits[ele].name === ele2.name) {
              index.push(ele);
            }
          }
        }
        for (let ele in this.transformedFlowunits) {
          if (index.indexOf(ele) == -1){
            data.flowunits.push(this.transformedFlowunits[ele]);
          }
        }
      }
      data.flowunits.forEach(item => {

        const group = this.nodeShapeCategories.find(i => i.title === item.group);
        const unit = {
          ...item,
          title: item.name,
          active: this.nodeShapeCategories.length == 0 ? true : false,
          types: [
            ...new Set(
              data.flowunits.filter(u => u.name === item.name).map(i => i.type)
            ),
          ],
        };

        if (group) {
          group.children.push(unit);
        } else {
          this.nodeShapeCategories.push({
            title: item.group,
            collapsed: true,
            children: [unit],
          });
        }

        this.dataService.nodeShapeCategories = this.nodeShapeCategories;

      });
    })

    this.nodeShapeCategories = this.dataService.nodeShapeCategories.map(
      item => {
        return {
          ...item,
          children: [...new Set(item.children.map(it => it.title))].map(it =>
            item.children.find(i => i.title === it)
          ),
        };
      }
    );
  }

  ngOnInit(): void {
    this.regFlowUnitPanel(this);
  }

  handleNodeShapeClick = shape => event => {
    event.stopPropagation();
    this.onNodeShapeClick(event, shape);
  };

  handleMouseOver = () => {
    this.onClick();
  };

  handleClick = () => {
    this.onClick();
  };

  handleNodeShapeDragStart = shape => event => {
    this.onNodeShapeDragStart(event, shape);
    let crt = event.currentTarget.cloneNode(true);
    crt.style.zIndex = "-100"
    crt.style.position = "absolute"; /* or visibility: hidden, or any of the above */
    crt.style.width = "200px";
    crt.style.height = "40px";
    crt.style.borderRadius = "20px";
    crt.style.opacity = "1";
    crt.style.border = "3px solid #E6E6FA";
    crt.style.boxShadow = "0 2px 0 0 #800000, 0";
    document.body.appendChild(crt);
    event.dataTransfer.setDragImage(crt, 0, 0);
  };

  handleNodeShapeDrag = shape => event => {
    event.currentTarget.style.opacity = "0.3";
  };

  handleNodeShapeDragEnd = shape => event => {
    this.onNodeShapeDragEnd(event);
    event.currentTarget.style.opacity = "1";
    document.body.removeChild(document.body.lastChild);
    document.body.removeChild(document.body.lastChild);
  };

  refreshFlowunit() {
    this.refreshEmmiter.emit("refresh");
  }
}
