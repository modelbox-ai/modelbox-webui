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

import { Component, TemplateRef, OnInit, Input, AfterViewInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { I18nService } from '@core/i18n.service';
import { AceComponent } from 'ngx-ace-wrapper';
import { BasicServiceService } from '@shared/services/basic-service.service';
import { TaskStatus } from '@shared/constants';
import { DialogService } from 'ng-devui/modal';
import { translate } from '@angular/localize/src/translate';
import { TableWidthConfig } from 'ng-devui/data-table';
import { EditableTip } from 'ng-devui/data-table';
import { IFileOptions, IUploadOptions, SingleUploadComponent } from 'ng-devui/upload';
import { ModalGuideComponent } from '../modal-guide/modal-guide.component';
import { FormLayout } from 'ng-devui/form';
import { MessageService } from '@shared/services/msg-service.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.less'],
})
export class ManagementComponent implements OnInit {
  @ViewChild(AceComponent, { static: true }) componentRef: AceComponent;
  @ViewChild('singleuploadDrag', { static: true }) singleuploadDrag: SingleUploadComponent;
  @ViewChild("debug", { static: true }) debugRef: "debug";
  page = "management";
  folded: boolean = false;
  checkedList: Array<any> = [];
  createTasklists: any;
  refresh_timer: any;
  addTaskData: Array<any> = [];
  newTaskText: string = this.i18n.getById('tasklist.newTask');
  res: any;
  tableData: any = { srcData: { data: [] } }
  tab1acticeID: string | number = 'tab1';
  openProjectList = [];
  layoutDirection: FormLayout = FormLayout.Horizontal;
  taskData: any = {
    displayed: [],
    srcData: {
      data: [],
      state: {
        searched: false,
        sorted: false,
        paginated: false,
      },
    },
    columns: [
      {
        field: 'checked',
        header: '',
        fieldType: 'customized'
      },
      {
        field: 'name',
        header: this.i18n.getById('tasklist.jobName'),
        fieldType: 'text'
      }
    ]
  }
  mainTableWidthConfig: TableWidthConfig[] = [{
    field: 'job_id',
    width: '20%'
  },
  {
    field: 'job_status',
    width: '20%'
  },
  {
    field: 'job_error_msg',
    width: '40%'
  },
  {
    field: 'job_operation',
    width: '20%'
  },]


  tableWidthConfig: TableWidthConfig[] = [{
    field: 'checked',
    width: '25px'
  },
  {
    field: 'name',
    width: '400px'
  },]

  tableWidthConfigKeyValue: TableWidthConfig[] = [{
    field: 'checked',
    width: '10%'
  },
  {
    field: 'key',
    width: '45%'
  }, {
    field: 'value',
    width: '45%'
  },]

  options = ['PUT', 'GET', 'POST', 'DELETE'];
  optionsTemplate = [];
  selectMethod = "GET";
  jsonSrc = "";
  jsonSrcObj = {};
  responseSrc = "";
  editor;
  config;
  values = ['Header', 'Body'];
  values1 = ['Header', 'Body'];
  choose = 'Body';
  choose1 = 'Body';
  url = "";
  headerSource = "";
  dataHeaders = [
    {
      ischecked: true,
      key: '',
      value: ''
    }
  ];
  editableTip = EditableTip.btn;
  deleteTaskLoading = false;


  dataTableOptions = {
    columns: [
      {
        field: 'job_id',
        header: this.i18n.getById("tasklist.jobName"),
        fieldType: 'text'
      },
      {
        field: 'job_status',
        header: this.i18n.getById("tasklist.jobStatus"),
        fieldType: 'text'
      },
      {
        field: 'job_error_msg',
        header: this.i18n.getById("tasklist.jobMessage"),
        fieldType: 'text'
      },
      {
        field: 'job_operation',
        header: this.i18n.getById("tasklist.jobOperation"),
        fieldType: 'text'
      }
    ]
  };
  selectTemplate: any;

  searchValue: string = '';
  placeholder: string = this.i18n.getById('tasklist.searchBarPlaceHolder')
  @Input() collapsed: boolean;
  @Input() isSupportFold: boolean = true;
  @Input() graphs: any = JSON.parse(localStorage.getItem('graphs')) || {};
  selectedProject: any;
  dialog: boolean = false;
  demo_list;
  fileOptions2: IFileOptions = {
    multiple: false,
    accept: '.png,.jpg',
  };
  uploadedFiles: Array<Object> = [];
  uploadOptions: IUploadOptions = {
    uri: '/upload',
    headers: {},
    maximumSize: 0.5,
    method: 'POST',
    fileFieldName: 'dFile',
    withCredentials: true,
    responseType: 'json'
  };
  selectedFiles: any;
  base64textString: string;
  showResponse = true;
  postmanErrorMsg: string;
  isSendingRequest = false;
  statusCode = "";
  responseBody: string;
  responseHeader: string;
  guide: any;
  currentTemplate: any;
  openproject_path: any;
  folderList: any;
  msgs: any;
  content: TemplateRef<any>;

  constructor(
    private dialogService: DialogService,
    private i18n: I18nService,
    private basicService: BasicServiceService,
    private message: MessageService
  ) { }

  ngOnInit(): void {
    this.getTaskslists();
    this.refresh_timer = setInterval(() => { this.getTaskslists(); }, 5000);
    this.basicService.queryTemplate().subscribe(
      (data: any) => {
        this.demo_list = data.project_template_list.filter(item => item.name !== "empty" && item.restapi);
        this.optionsTemplate = this.demo_list.map(item => item.name);
      },
      (error) => {
        return null;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.refresh_timer) {
      clearInterval(this.refresh_timer);
      this.refresh_timer = null;
    }
  }

  handleFileSelect(evt) {
    let files = evt.target.files;
    let file = files[0];
    if (files && file) {
      let reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    let binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
  }

  selectText() {
    const input = document.getElementById('textArea') as HTMLInputElement;
    input.focus();
    input.select();
    input.setSelectionRange(0, input.value.length);
    let res = document.execCommand('copy');
    if (res) {
      this.msgs = [
        { severity: 'success', content: this.i18n.getById('message.copySuccessfully') }
      ];
    }

  }

  handleChange(value) {
    this.jsonSrc = value;
    try {
      this.jsonSrcObj = JSON.parse(value);
    } catch (e) { }
  }

  handleChange1(value) {
    this.responseSrc = value;
  }

  beautifyJson() {
    this.jsonSrc = JSON.stringify(this.jsonSrcObj, null, 2);
  }

  templateChange(value) {
    this.currentTemplate = value;
    for (let i of this.demo_list) {
      if (i.name === value) {
        if (i.restapi) {
          this.selectMethod = i.restapi?.method;
          let t = JSON.stringify(i.restapi?.requestbody);
          t = JSON.parse(t);
          this.jsonSrc = t;
          this.url = i.restapi?.path;
        } else {
          this.selectMethod = "GET";
          this.jsonSrc = "";
          this.url = "";
        }
        if (i.guide) {
          this.guide = i.guide?.guide;
        } else {
          this.guide = null;
        }
      }
    }
  }

  searchDirectory(path = null) {
    if (!path) {
      path = this.openproject_path;
    }
    this.basicService.loadTreeByPath(path).subscribe(
      (data: any) => {
        if (data.subdir) {
          this.folderList = [{ "folder": this.i18n.getById('toolBar.modal.return'), "isProject": this.i18n.getById('ifModelboxProject') }];
          data.subdir.forEach(element => {
            this.folderList.push({ "folder": element.dirname });
          });
        }
      },
      error => {
        if (error) {
          if (error.staus == 404) {
            this.msgs = [
              { severity: 'warn', content: this.i18n.getById('message.noFolder') }
            ];
          }
        }
        this.folderList = [];
        return;
      });
  }

  cellClick(e) {
    if (e.rowIndex === 0) {
      let position = this.openproject_path.lastIndexOf("/");
      this.openproject_path = this.openproject_path.substring(0, position);
    } else {
      this.openproject_path = this.openproject_path + "/" + e.rowItem.folder;
    }
    this.searchDirectory(this.openproject_path);
  }

  onPathSelect(e) {
    this.openproject_path = e;
    this.searchDirectory(this.openproject_path);
  }

  openstandardDialog(dialogtype?: string) {
    const results = this.dialogService.open({
      id: 'dialog-service',
      width: '346px',
      maxHeight: '900px',
      title: this.currentTemplate,
      content: ModalGuideComponent,
      backdropCloseable: false,
      dialogtype: dialogtype,
      onClose: () => {
      },
      buttons: [
      ],
      data: {
        guide: this.guide
      },
    });
    return results;
  }

  radioValueChange(val) {
    if (val === "Body") {
      this.responseSrc = this.responseBody;
    } else if (val === "Header") {
      this.responseSrc = this.responseHeader;
    }
  }

  customUploadEvent() {
    this.singleuploadDrag.upload();
  }

  handleSend() {
    this.isSendingRequest = true;
    let obj = new Object();
    this.dataHeaders.map((i) => {
      if (i.key != '') {
        obj[i.key] = i.value;
      }
    });
    this.basicService.customRequest(this.selectMethod, this.url, this.jsonSrc, obj).subscribe(

      (data: any) => {
        this.showResponse = true;
        this.isSendingRequest = false;
        this.statusCode = data.body.status;
        this.responseHeader = data.body.headers;
        this.responseBody = data.body.body;
        this.responseBody = JSON.stringify(this.responseBody, null, 2);
        this.responseBody = this.responseBody.replace("\\u0000", "");
        this.responseBody = JSON.parse(this.responseBody);
        try {
          this.responseBody = (new Function("return " + this.responseBody))();
        } catch {

        }

        this.responseBody = JSON.stringify(this.responseBody, null, 2);
        this.responseHeader = JSON.stringify(this.responseHeader, null, 2);

        if (this.choose1 === "Body") {
          this.responseSrc = this.responseBody;
        } else if (this.choose1 === "Header") {
          this.responseSrc = this.responseHeader;
        }
        return;

      },
      error => {
        this.showResponse = false;
        this.isSendingRequest = false;
        this.postmanErrorMsg = error.message;

        return null;
      }
    );
  }

  handleClear() {
    this.selectTemplate = null;
    this.url = "";
    this.responseSrc = null;
    this.selectMethod = "GET";
    this.jsonSrc = null;
    this.dataHeaders = [{
      ischecked: true,
      key: '',
      value: ''
    }];
  }

  beforeEditEnd = (rowItem, field) => {
    let obj = {
      ischecked: true,
      key: '',
      value: ''
    }
    let v = this.dataHeaders[this.dataHeaders.length - 1];
    if (v.key != '' || v.value != '') {
      this.dataHeaders.push(obj);
    }
    if (v.key == '' && v.value == '' && this.dataHeaders.length > 1) {
      let v2 = this.dataHeaders[this.dataHeaders.length - 2];
      if (v2.key == '' && v.value == '') {
        this.dataHeaders.pop();
      }
    }
  };

  handleDelete(e) {
    if (this.dataHeaders.length > 1) {
      this.dataHeaders.splice(e, 1);
      return
    }
    if (this.dataHeaders[0].key == '' && this.dataHeaders[0].value == '') {
      return;
    }
    this.dataHeaders[0].key = '';
    this.dataHeaders[0].value = '';
  }

  showDebugPanel(content: TemplateRef<any>) {

    const results = this.dialogService.open({
      id: 'dialog-debug',
      title: this.i18n.getById('toolBar.debug'),
      width: '1000px',
      maxHeight: '800px',
      showAnimation: true,
      contentTemplate: content,
      buttons: [],
      onClose: ($event: Event) => {
      }
    });
    return results;
  }

  onRowCheckChange(checked, rowIndex, nestedIndex, rowItem) {
    rowItem.checked = checked;
    this.selectedProject = rowItem;
    this.taskData.srcData.data.map(function (obj) {
      if (obj.job_id != rowItem.job_id) {
        obj.checked = false;
      }
      return obj;
    });
  }

  // 获取任务列表
  public getTaskslists() {
    this.basicService.getTaskLists().subscribe((data: any) => {
      this.tableData.srcData.data = this.tasksListparse(data.job_list);
      this.message.changeMessage(data.job_list);
    },
      (error) => {
        this.tableData.srcData.data.forEach(item => {
          item.job_status_value = TaskStatus.UNKNOWN;
        });
      })
  }

  // 删除任务
  deleteData(row: any) {
    const results = this.dialogService.open({
      id: 'management-delete',
      width: '400px',
      showAnimation: true,
      title: this.i18n.getById('toolBar.deleteDialogButton'),
      backdropCloseable: false,
      dialogtype: 'standard',
      content: this.i18n.getById('management.doYouWantToDeleteThisRecord?'),
      buttons: [{
        cssClass: 'danger',
        text: this.i18n.getById('modal.okButton'),
        disabled: false,
        handler: ($event: Event) => {
          results.modalInstance.hide();
          results.modalInstance.zIndex = -1;

          this.deleteTaskLoading = true;
          this.deleteTask(row);
        },
      },
      {
        id: 'management-cancel',
        cssClass: 'common',
        text: this.i18n.getById('modal.cancelButton'),
        handler: ($event: Event) => {
          results.modalInstance.hide();
          results.modalInstance.zIndex = -1;
          this.deleteTaskLoading = false;
        },
      },],
    });
    return results;
  }

  // 任务列表数据处理
  private tasksListparse(data) {
    data.forEach(item => {
      switch (item.job_status) {
        case "CREATEING":
          return item.job_status_value = TaskStatus.CREATEING;
        case "RUNNING":
          return item.job_status_value = TaskStatus.RUNNING;
        case "SUCCEEDED":
          return item.job_status_value = TaskStatus.SUCCEEDED;
        case "FAILED":
          return item.job_status_value = TaskStatus.FAILED;
        case "PENDING":
          return item.job_status_value = TaskStatus.PENDING;
        case "DELETEING":
          return item.job_status_value = TaskStatus.DELETEING;
        case "UNKNOWN":
          return item.job_status_value = TaskStatus.UNKNOWN;
        case "NOTEXIST":
          return item.job_status_value = TaskStatus.NOTEXIST;
      }
    });
    return data;
  }

  // 删除任务
  public deleteTask(option) {
    this.basicService.deleteTask(option.job_id)
      .subscribe(data => {
        let obj = {};
        obj[option.job_id.substring(0, option.job_id - ".toml".length)] = false;
        sessionStorage.setItem('statusGraph', JSON.stringify(obj));
        const results = this.dialogService.open({
          id: 'task-delete-success',
          width: '346px',
          maxHeight: '600px',
          title: '',
          content: this.i18n.getById('management.taskHasBeenDeletedSuccessfully'),
          backdropCloseable: false,
          dialogtype: 'success',
          buttons: [
            {
              cssClass: 'primary',
              text: this.i18n.getById('modal.okButton'),
              handler: ($event: Event) => {
                results.modalInstance.hide();
                this.deleteTaskLoading = false;
              },
            }
          ],
        });
        this.getTaskslists();

      },
        (error) => error => {
          const results = this.dialogService.open({
            id: 'task-delete-fail',
            width: '346px',
            maxHeight: '600px',
            title: '',
            content: this.i18n.getById('management.failToDeleteTask'),
            backdropCloseable: false,
            dialogtype: 'error',
            buttons: [
              {
                cssClass: 'primary',
                text: this.i18n.getById('modal.okButton'),
                handler: ($event: Event) => {
                  results.modalInstance.hide();
                },
              }
            ],
          });
          this.getTaskslists();
        }
      )
  }
}
