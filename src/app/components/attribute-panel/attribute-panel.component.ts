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

import {
  Component,
  ViewChild,
  Input,
  ViewEncapsulation,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataServiceService } from '@shared/services/data-service.service';
import { translate } from '@angular/localize/src/translate';
import { I18nService } from '@core/i18n.service';
import { FormLayout } from 'ng-devui/form';
import { DialogService } from 'ng-devui';
import { Output, EventEmitter } from '@angular/core';
import { TableWidthConfig } from 'ng-devui/data-table';

@Component({
  selector: 'app-attribute-panel',
  templateUrl: './attribute-panel.component.html',
  styleUrls: ['./attribute-panel.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class AttributePanelComponent {
  layoutDirection: FormLayout = FormLayout.Vertical;
  @ViewChild('myForm1') attrform;
  @Input() config: any;
  @Input() onNodeAttributeChange: any;
  @Output() newItemEvent = new EventEmitter<any>();
  selectType = this.i18n.getById('attributePanel.selectType');
  changedValue = false;
  newName: string;
  item: {
    name: '',
    required: false,
    type: '',
    default: '',
    desc: '',
    values: '',
  };
  warnNoNode = true;
  // 节点对应的顶点信息
  unit: {
    name: '',
    version: '',
    descryption: '',
    desc: '',
    group: '',
    virtual: false,
    types: [],
    type: '',
    options: [any],
    inputports: [any],
    outputports: [any],
    portDetail: '',
    constraint: ''
  };
  // unitType
  unitType: any = {
    options: [],
    selected: {},
    init: () => {
      if (this.unit) {
        this.unitType.options = this.unit.types.map(item => {
          return {
            id: item,
            label: item,
          };
        });
        this.unitType.selected = this.unitType.options.find(
          item => item.id === this.unit.type
        );
      }
    },
    change: (event, form) => {
      const unitType = this.config.attributes.find(
        item => item.key === 'device'
      );
      unitType.value = event.id;

      this.initConfig(this.config);
      this.attributeModel.blur(form);
    },
  };
  unitOptions: any = {
    data: [],
    init: () => {
      this.unitOptions.data = [];
      if (this.unit) {
        this.unit.options.forEach(item => {
          let formItem: any = {
            label: item.name.replace(/_/g, " "),
            required: item.required,
            type: item.type,
            default: item.default,
            desc: item.desc,
            values: item.values,
          };

          if (item.type === 'int' || item.type === 'integer') {
            formItem.value = item.default;
          } else if (item.type === 'bool') {
            formItem.value = false
          } else if (item.type === 'list') {
            formItem.options = Object.keys(item.values).map(it => {
              return {
                id: it,
                label: it,
              };
            });
            formItem.selected =
              (item.default &&
                formItem.options.find(it => it.id === item.default)) ||
              {};
          } else {
            // 字符串场景
            formItem.value = item.default || '';
          }
          this.unitOptions.data.push(formItem);
        });
      }
    },
  };

  attributeModel = {
    add: (form: FormGroup) => {
      this.config.attributes.push({
        key: '',
        value: '',
      });
    },
    del: index => {
      this.config.attributes.splice(index, 1);
      this.onNodeAttributeChange({ ...this.config, newName: this.newName });
    },
    blur: (form: FormGroup) => {
      let config = { ...this.config };
      // 处理 node name
      if (this.newName !== this.config.name && this.unit) {
        if (
          this.unit.inputports.find(item => item.name === this.newName) ||
          this.unit.outputports.find(item => item.name === this.newName)
        ) {
          const results = this.dialogService.open({
            id: 'dialog-service',
            width: '346px',
            maxHeight: '600px',
            title: '',
            content: this.i18n.getById('message.duplicatedNodeName'),
            backdropCloseable: true,
            dialogtype: 'failed',
            buttons: [
              {
                cssClass: 'primary',
                text: 'Ok',
                handler: ($event: Event) => {
                  results.modalInstance.hide();
                  results.modalInstance.zIndex = -1;
                },
              }
            ],
          });
          return;
        }
      }
      // 处理 type
      let attrType = config.attributes.find(item => item.key === 'device');
      attrType.value = this.unitType.selected.id;
      // 处理 options
      this.unitOptions.data.forEach(item => {
        let attr = config.attributes.find(it => it.key === item.label.replaceAll(' ', '_'));
        if (['string', 'int', 'integer', 'bool'].includes(item.type)) {
          if (item.value !== item.default && item.value !== '') {
            if (attr) {
              attr.value = item.value;
            } else {
              config.attributes.push({
                key: item.label.replaceAll(" ", "_"),
                value: item.value,
              });
            }
          } else {
            config.attributes = config.attributes.filter(
              it => it.key !== item.label.replaceAll(" ", "_")
            );
          }
        } else if (item.type === 'list') {
          if (item.selected && item.selected.id !== item.pp) {
            if (attr) {
              attr.value = item.selected.id;
            } else {
              config.attributes.push({
                key: item.label.replaceAll(' ', '_'),
                value: item.selected.id,
              });
            }
          } else {
            config.attributes = config.attributes.filter(
              it => it.key !== item.label.replaceAll(' ', '_')
            );
          }
        }
      });
      this.config.name = this.newName;
      this.onNodeAttributeChange({ ...config, newName: this.newName });

    }
  };

  unitName: any;

  descTableOptions = {
    columns: [
      {
        field: 'fieldName',
        header: 'Field Name',
        fieldType: 'text'
      },
      {
        field: 'type',
        header: 'Type',
        fieldType: 'text'
      }
    ]
  };
  descDataSource: Object[] = [];

  descWidthConfig: TableWidthConfig[] = [
    {
      field: 'fieldName',
      width: '40%'
    },
    {
      field: 'type',
      width: '60%'
    }
  ];

  menu1 = [{
    title: '配置',
    children: [],
  }];

  menu2 = [{
    title: '描述',
    children: [],
  }];

  menuToggle1(event) {
    console.log('menu toggle' + JSON.stringify(event));
  }

  menuToggle2(event) {
    console.log('menu toggle' + JSON.stringify(event));
  }

  constructor(
    private dataService: DataServiceService,
    private i18n: I18nService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    if (this.config) {
      this.initConfig(this.config);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.config) {
      this.initConfig(this.config);
    }
  }

  ngOnDestroy() {
    if (this.changedValue == false) {
      return;
    }

    this.attributeModel.blur(this.attrform);
    this.config = null;
    this.changedValue = false;
  }

  handleTipText(context) {
    if (context) {
      let reg = /(?<=[@.*:])[\s\S]*?(?=@)/g;
      context.descryption = context.descryption.replace(/::/g, "->");
      let res = context.descryption.match(reg);
      let group = [];
      let smix = "";
      if (res !== null) {
        if (context.descryption.indexOf("@Constraint:") != -1) {
          group = context.descryption.split("@Constraint:");
          if (group.length > 0) {
            context.constraint = group[1].trim();
          }
        }

        for (let i of res) {
          group = i.split("\n");
          if (group.length > 0 && group[0].indexOf("Brief") != -1) {
            smix = group[0].replace("Brief:", "").trim();
            for (let j = 1; j < group.length; j++) {
              smix += group[j];
            }
            context.desc = smix.trim();
          }

          let tempstr = "";
          let tempstr_group = [];
          this.descDataSource = [];
          if (group.length > 0 && group[0].indexOf("Port parameter") != -1) {
            smix = ""
            for (let j = 0; j < group.length; j++) {
              tempstr = group[j].replace(/:/g, "").trim();
              if (tempstr.indexOf("Field Name") != -1 && tempstr.indexOf("Type") != -1) {
                tempstr = tempstr.replace(/Field Name/g, "").replace(/Type/g, "").trim();
                tempstr_group = tempstr.split(",");
                if (tempstr_group.length === 2) {
                  this.descDataSource.push({ fieldName: tempstr_group[0].trim(), type: tempstr_group[1].trim().replace(/->/g, "::") });
                }
              } else {
                smix += tempstr.replace(/Port parameter/, "").trim() + "\n";
              }
            }
            context.portDetail = this.handlePortDetail(smix.trim());
          }
        }
      }
    }
    return context;
  }

  handlePortDetail(portDetail) {
    portDetail = portDetail.replace(/\t/g, "  ");
    portDetail = portDetail.replace(/->/g, "::");
    return portDetail;
  }

  initConfig(config) {
    this.changedValue = false;
    this.unit = this.getUnit(config);
    this.unitType.init();
    this.unitOptions.init();
    if (!this.unit && this.warnNoNode && this.config.attributes.length === 0) {
      this.newItemEvent.emit(null);
      this.warnNoNode = false;
      const results = this.dialogService.open({
        id: 'dialog-service',
        width: '346px',
        maxHeight: '600px',
        title: '',
        content: this.i18n.getById('message.cannotFindCorrespondingDefinition'),
        backdropCloseable: true,
        dialogtype: 'failed',
        buttons: [
          {
            cssClass: 'primary',
            text: 'Ok',
            handler: ($event: Event) => {
              results.modalInstance.hide();
              results.modalInstance.zIndex = -1;
            },
          }
        ],
      });

      return;
    }
    this.handleTipText(this.unit);
    // type
    this.config.attributes.forEach(item => {
      if (item.key === 'device') {
        this.unitType.selected = this.unitType.options.find(
          it => it.id === item.value
        );
      }
      this.unitOptions.data.forEach(it => {
        if (it.label.replaceAll(" ", "_") === item.key) {
          if (['string', 'int', 'integer'].includes(it.type)) {
            it.value = item.value;
          } else if (it.type === 'bool') {
            if (item.value.toLowerCase() === "true") {
              it.value = true;
            } else {
              it.value = false;
            }
          } else if (it.type === 'list') {
            it.selected = it.options.find(i => i.id === item.value);
          }
        }
      });
    });

    this.newName =
      config?.name ||
      config?.attributes.find(item => item.key === 'label')?.value;
  }

  getUnit(config) {
    const flowUnit = config.attributes.find(item => item.key === 'flowunit')
      ?.value;
    const unitType = config.attributes.find(item => item.key === 'device')
      ?.value;
    return this.dataService.getUnit(flowUnit, unitType);
  }
}
