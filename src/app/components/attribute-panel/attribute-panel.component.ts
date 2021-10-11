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

@Component({
  selector: 'app-attribute-panel',
  templateUrl: './attribute-panel.component.html',
  styleUrls: ['./attribute-panel.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class AttributePanelComponent {
  layoutDirection: FormLayout = FormLayout.Horizontal;
  @ViewChild('myForm1') attrform;

  selectType = this.i18n.getById('attributePanel.selectType');
  @Input() config: any;
  @Input() onNodeAttributeChange: any;
  @Output() newItemEvent = new EventEmitter<any>();
  changedValue = false
  newName: string;
  item: {
    name: '',
    required: false,
    type: '',
    default: '',
    desc: '',
    values: '',
  }
  // 节点对应的顶点信息
  unit: {
    name: '',
    version: '',
    descryption: '',
    group: '',
    virtual: false,
    types: [],
    type: '',
    options: [any],
    inputports: [any],
    outputports: [any]
  };
  // unitType
  unitType: any = {
    options: [],
    selected: {},
    init: () => {
      this.unitType.options = this.unit.types.map(item => {
        return {
          id: item,
          label: item,
        };
      });
      this.unitType.selected = this.unitType.options.find(
        item => item.id === this.unit.type
      );
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
      this.unit.options.forEach(item => {
        let formItem: any = {
          label: item.name,
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
        let attr = config.attributes.find(it => it.key === item.label);
        if (['string', 'int', 'integer', 'bool'].includes(item.type)) {
          if (item.value !== item.default && item.value !== '') {
            if (attr) {
              attr.value = item.value;
            } else {
              config.attributes.push({
                key: item.label,
                value: item.value,
              });
            }
          } else {
            config.attributes = config.attributes.filter(
              it => it.key !== item.label
            );
          }
        } else if (item.type === 'list') {
          if (item.selected && item.selected.id !== item.pp) {
            if (attr) {
              attr.value = item.selected.id;
            } else {
              config.attributes.push({
                key: item.label,
                value: item.selected.id,
              });
            }
          } else {
            config.attributes = config.attributes.filter(
              it => it.key !== item.label
            );
          }
        }
      });
      this.config.name = this.newName;
      this.onNodeAttributeChange({ ...config, newName: this.newName });

    }
  };
  unitName: any;

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
      return
    }

    this.attributeModel.blur(this.attrform)
    this.config = null
    this.changedValue = false;
  }

  initConfig(config) {
    this.changedValue = false
    this.unit = this.getUnit(config);
    if (!this.unit) {
      this.newItemEvent.emit(null)
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
    this.unitType.init();
    this.unitOptions.init();
    // type
    this.config.attributes.forEach(item => {
      if (item.key === 'device') {
        this.unitType.selected = this.unitType.options.find(
          it => it.id === item.value
        );
      }
      this.unitOptions.data.forEach(it => {
        if (it.label === item.key) {
          if (['string', 'int', 'integer'].includes(it.type)) {
            it.value = item.value;
          } else if (it.type === 'bool') {
            if (item.value.toLowerCase() === "true") {
              it.value = true
            } else {
              it.value = false
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
