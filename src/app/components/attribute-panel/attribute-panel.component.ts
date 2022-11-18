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
  @Input() dotGraph: any;
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
  unit: any;
  currentPage = "main";
  // unitType
  unitType: any = {
    options: [],
    selected: {},
    init: () => {
      if (this.unit) {
        if (this.unit.group === "Port") {
          this.unitType.options = this.dataService.deviceTypes.map(item => {
            return {
              id: item,
              label: item,
            };
          });
          return;
        }
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
      this.attributeModel.blur();
    },
  };
  unitOptions: any = {
    data: [],
    init: () => {
      this.unitOptions.data = [];
      if (this.unit && this.unit.options) {
        this.unit.options.forEach(item => {
          let formItem: any = {
            label: item.name?.replace(/_/g, " "),
            required: item.required,
            type: item.type,
            default: item.default,
            desc: item.desc,
            values: item.values
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
    blur: () => {
      let config = { ...this.config };
      // 处理 node name更改
      if ((this.newName !== this.config.name) && (this.unit != undefined)) {
        const nodes = { ...this.dotGraph?.nodes };
        let nodesName = Object.keys(nodes);
        if (nodesName.indexOf(this.newName) > -1) {
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
        if (!this.unit["inputports"]) this.unit["inputports"] = [];
        if (!this.unit["outputports"]) this.unit["outputports"] = [];
        if (
          this.unit.inputports?.find(item => item.name === this.newName) ||
          this.unit.outputports?.find(item => item.name === this.newName)
        ) {
          //node同名处理
          const results = this.dialogService.open({
            id: 'dialog-service',
            width: '346px',
            maxHeight: '600px',
            title: '',
            content: this.i18n.getById('message.duplicatedNodeNameWithPort'),
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
        let attr = config.attributes.find(it => it.key === item.label?.replaceAll(' ', '_'));
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
      // 处理 advanced
      config = this.handleAdvance(config, "deviceid");
      config = this.handleAdvance(config, "batchSize");
      config = this.handleAdvance(config, "queueSize");
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
    title: this.i18n.getById('attribute.conf'),
    children: [{ active: true }],
  }];

  menu2 = [{
    title: this.i18n.getById('attribute.desc'),
    children: [],
  }];

  menu3 = [{
    title: this.i18n.getById('attribute.advance'),
    children: [],
  }];

  portOptions = {
    columns: [
      {
        field: 'fieldName',
        header: this.i18n.getById('portName'),
        fieldType: 'text'
      },
      {
        field: 'type',
        header: this.i18n.getById('deviceHandleType'),
        fieldType: 'text'
      }
    ]
  };

  deviceid: any;
  batchSize: any;
  queueSize: any;
  isPort = false;

  constructor(
    private dataService: DataServiceService,
    private i18n: I18nService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    if (this.config) {
      this.initConfig(this.config);
    }
    this.currentPage = this.dataService.currentPage;
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

    this.attributeModel.blur();
    this.config = null;
    this.changedValue = false;
  }

  handleTipText(context) {
    if (context) {
      let reg = /(?<=[@.*:])[\s\S]*?(?=@)/g;
      context.description = context.description.replace(/::/g, "->");
      let res = context.description.match(reg);
      let group = [];
      let smix = "";
      if (res !== null) {
        if (context.description.indexOf("@Constraint:") != -1) {
          group = context.description.split("@Constraint:");
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

  initUnit(config = null) {
    this.unit = {
      name: '',
      version: '',
      description: '',
      desc: '',
      group: '',
      virtual: false,
      types: [],
      type: '',
      options: [""],
      inputports: [""],
      outputports: [""],
      advance: {
        deviceid: "",
        batchSize: "",
        queueSize: ""
      },
      portDetail: '',
      constraint: ''
    }
    if (config) {
      this.unit.name = config.name;
      this.unit.group = "Generic";

      config.attributes.forEach(it => {
        if (it.key === "device") {
          this.unit.type = it.value;
          this.unit.types = [it.value];
        }
        if (it.key === "type") {
          if (it.value === "input" || it.value === "output") {
            this.unit.type = this.dataService.deviceTypes[0];
            this.unit.types = this.dataService.deviceTypes;
            this.unit.group = "Port";
            this.isPort = true;
          }
        }
      });
    }
    this.unit && this.unit.advance;
  }

  initConfig(config) {
    this.changedValue = false;

    this.unit = this.getUnit(config);
    if (this.unit === undefined) {
      this.initUnit(config);
    }

    this.unit.advance = {
      deviceid: "",
      batchSize: "",
      queueSize: ""
    }

    this.unitType.init();
    this.unitOptions.init();

    if (!this.unit && this.warnNoNode && this.config['attributes']) {
      if (this.config['attributes'].length === 0) {
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
      }
      return;
    }

    this.handleTipText(this.unit);
    // type
    if (this.config['attributes']) {
      this.config.attributes.forEach(item => {
        if (item.key === 'device') {
          this.unitType.selected = this.unitType.options.find(
            it => it.id === item.value
          );
        }
        if (item.key === 'deviceid') {
          this.unit.advance.deviceid = item.value;
        }
        if (item.key === 'batch_size') {
          this.unit.advance.batchSize = item.value;
        }
        if (item.key === 'queue_size') {
          this.unit.advance.queueSize = item.value;
        }
        if (item.key === "type") {
          if (item.value === "input" || item.value === "output") {
            this.isPort = true;
          } else {
            this.isPort = false;
          }
        }
        this.unitOptions.data.forEach(it => {
          if (it.label?.replaceAll(" ", "_") === item.key) {
            if (['string', 'int', 'integer'].includes(it.type)) {
              it.value = item.value;
            } else if (it.type === 'bool') {
              if (item.value.toLowerCase() === "true") {
                it.value = true;
              } else {
                it.value = false;
              }
            } else if (it.type === 'list') {
              it.selected = it?.options.find(i => i.id === item.value);
            }
          }
        });
      });
      this.newName =
        config?.name ||
        config?.attributes.find(item => item.key === 'label')?.value;
    }
    if (this.unit.inputports.length > 0) {
      this.unit.inputports.forEach(element => {
        if (element) {
          if (!element.device_type) {
            element.device_type = this.unit.type;
          }
        }
      });
    }
    if (this.unit.outputports.length > 0) {
      this.unit.outputports.forEach(element => {
        if (element) {
          if (!element.device_type) {
            element.device_type = this.unit.type;
          }
        }
      });
    }
  }

  getUnit(config) {
    if (config.attributes) {
      const flowUnit = config.attributes.find(item => item.key === 'flowunit')
        ?.value;
      const unitType = config.attributes.find(item => item.key === 'device')
        ?.value;
      return this.dataService.getUnit(flowUnit, unitType);
    }
  }

  handleAdvance(config, prop) {
    let num = config.attributes.find((item, index) => {
      if (item.key === prop) {
        return index;
      }
    });
    if (num) {
      if (num?.value) {
        if (this.unit["advance"][prop]) {
          config.attributes[config.attributes.indexOf(num)].value = this.unit["advance"][prop];
        } else {
          config.attributes.splice(config.attributes.indexOf(num));
        }
      }
    } else {
      if (this.unit["advance"][prop]) {
        let name;
        if (prop === "deviceid") {
          name = "deviceid";
        }
        if (prop === "batchSize") {
          name = "batch_size";
        }
        if (prop === "queueSize") {
          name = "queue_size";
        }
        config.attributes.push({
          key: name,
          value: this.unit["advance"][prop]
        });
      }
    }
    return config;
  }
}
