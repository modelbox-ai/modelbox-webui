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
import { ToastService } from 'ng-devui/toast';

declare const require: any

@Component({
  selector: 'app-insert-panels',
  templateUrl: './insert-panels.component.html',
  styleUrls: ['./insert-panels.component.less'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
     .tooltip-inner {
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
  @Output() deviceTypeEmmiter = new EventEmitter();
  imgSvg = "../../../assets/img.svg";
  videoSvg = "../../../assets/video.svg";
  commonSvg = "../../../assets/common.svg";
  inputSvg = "../../../assets/input.svg";
  outputSvg = "../../../assets/output.svg";
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
  showSlideMenu = true;

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
  categories: any;
  context: any;
  eles: any;
  constructor(
    private sanitized: DomSanitizer,
    private dataService: DataServiceService,
    private basicService: BasicServiceService,
    private i18n: I18nService
  ) { }

  toggleTip(tooltip, context: any) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      context = this.handleTipText(context);
      tooltip.open({ context });
    }
    this.context = context;
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

  onSearch(term) {
    let eles = document.querySelectorAll('.search-detail');
    if (!eles) {
      eles = this.eles;
    }
    if (term) {
      let firstResult = null;
      eles.forEach(element => {
        let name = element['outerText']?.trim();
        if (name.indexOf(term) === -1) {
          this.hideEle(element);
        } else {
          if (!firstResult) {
            firstResult = element;
          }
          this.showEle(element);
        }
      });
      if (!firstResult) {
        return;
      }
      let title = this.searchGroupByNameOfCategories(firstResult['outerText']?.trim());
      this.nodeShapeCategories.forEach((item) => {
        if (item.title === title) {
          item.open = true;
        } else {
          item.open = false;
        }
      });
    } else {
      eles.forEach(element => {
        this.showEle(element);
      });
      this.nodeShapeCategories.forEach((item, index) => {
        if (index === 0) {
          item.open = true;
        } else {
          item.open = false;
        }
      });
    }
  }

  searchGroupByNameOfCategories(name) {
    let res;
    this.nodeShapeCategories.forEach(item => {
      item.children.forEach(element => {
        if (element['name'] === name) {
          res = item.title
          return res;
        }
      });
    });
    return res;
  }

  private hideEle(element) {
    element.setAttribute('style', `display: none`);
  }

  private showEle(element) {
    element.setAttribute('style', `text-align: start;
    display: flex;
    align-items: center;
    justify-content: left;
    position: relative;
    margin-top: 10px;
    height: 40px;
    color: rgb(87, 93, 108);`
    );
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
    this.basicService.queryData(params).subscribe((data) => {
      this.nodeShapeCategories = [];
      this.dataService.nodeShapeCategories = [];
      if (data.devices == null) {
        return;
      }
      if (data.devices) {
        data.devices.forEach(item => {
          if (this.dataService.deviceTypes.indexOf(item.type.toLowerCase()) === -1) {
            this.dataService.deviceTypes.push(item.type.toLowerCase());
          }
        });
        this.deviceTypeEmmiter.emit(this.dataService.deviceTypes);
      }

      if (this.dataService.virtualFlowunits.length > 0) {
        data.flowunits.push.apply(data.flowunits, this.dataService.virtualFlowunits);
      }
      let objInput = {
        descryption: "",
        group: "Virtual",
        name: "Input",
        title: "Input",
        type: "Input",
        types: "",
        version: "",
        virtual: true
      }
      let objOutput = {
        descryption: "",
        group: "Virtual",
        name: "Output",
        title: "Output",
        type: "Output",
        types: "",
        version: "",
        virtual: true
      }
      data.flowunits.push.apply(data.flowunits, [objInput, objOutput]);
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
  };

  refreshFlowunit() {
    this.refreshEmmiter.emit("refresh");
  }
}
