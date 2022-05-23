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
import { ErrorCode, TaskStatus } from '@shared/constants';
import { DialogService } from 'ng-devui/modal';
import { translate } from '@angular/localize/src/translate';
import { CommonUtils } from '@shared/utils';
import { TableWidthConfig } from 'ng-devui/data-table';
import { EditableTip } from 'ng-devui/data-table';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataServiceService } from '@shared/services/data-service.service';
import { IFileOptions, IUploadOptions, SingleUploadComponent } from 'ng-devui/upload';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.less'],
})
export class ManagementComponent implements OnInit {
  @ViewChild(AceComponent, { static: true }) componentRef: AceComponent;
  @ViewChild('singleuploadDrag', { static: true }) singleuploadDrag: SingleUploadComponent;
  page = "task";
  folded: boolean = false;
  checkedList: Array<any> = [];
  createTasklists: any;
  refresh_timer: any;
  addTaskData: Array<any> = [];
  newTaskText: string = this.i18n.getById('tasklist.newTask');
  res: any;
  tableData: any = { srcData: { data: [] } }
  tab1acticeID: string | number = 'tab1';
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
  currentRow;
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

  constructor(
    private dialogService: DialogService,
    private i18n: I18nService,
    private basicService: BasicServiceService,
    private util: CommonUtils,
    private dataService: DataServiceService,
    private http: HttpClient,
    @Inject(DOCUMENT) private doc: any) { }

  ngOnInit(): void {
    this.getTaskslists();
    this.refresh_timer = setInterval(() => { this.getTaskslists(); }, 5000);
    this.optionsTemplate;
    this.basicService.querySolutionList().subscribe(
      (data: any) => {
        this.demo_list = data.demo_list;
        this.optionsTemplate = data.demo_list.map(item => item.name);
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
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
  }


  handleChange(value) {
    this.jsonSrc = value;
    try {
      this.jsonSrcObj = JSON.parse(value);
    } catch (e) { }
  }

  beautifyJson() {
    this.jsonSrc = JSON.stringify(this.jsonSrcObj, null, 2);
  }

  templateChange(value) {
    //get demo file detail
    let graphfile;
    let demo;
    for (let i of this.demo_list) {
      if (value === i.name) {
        graphfile = i.graphfile;
        demo = i.demo
        break;
      }
    }
    this.basicService.querySolution(demo + "/" + graphfile).subscribe((data) => {
      this.selectMethod = data.restapi.method;
      let t = JSON.stringify(data.restapi.requestbody);
      t = JSON.parse(t);
      this.jsonSrc = t;
      let regex = new RegExp(/(?<=endpoint=").*?(?=")/, "g");
      let r = data.graph.graphconf.match(regex)[0].split(":");
      let path = data.restapi.path;
      let port = r.length > 0 ? r[r.length - 1] : "";
      this.url = port ? window.location.hostname + ":" + port + path : window.location.hostname + path;
      this.url = window.location.protocol + "//" + this.url;
    });
  }

  radioValueChange(val) {
  }

  radioValueChange1(val) {
    if (val === "Body"){
      this.responseSrc = this.responseBody;
    }else if (val === "Header"){
      this.responseSrc = this.responseHeader;
    }
  }

  customUploadEvent() {
    this.singleuploadDrag.upload();
  }

  deleteUploadedFile(filePath: string) {

  }

  getImgBase64() {
    var base64 = "";
    var img = new Image();
    img.src = "img/test.jpg";
    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      base64 = canvas.toDataURL("image/png");
      alert(base64);
    }
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
        try{
          this.responseBody = (new Function("return " + this.responseBody))();
        }catch{

        }
        
        this.responseBody = JSON.stringify(this.responseBody, null, 2);
        this.responseHeader = JSON.stringify(this.responseHeader, null, 2);

        if (this.choose1 === "Body"){
          this.responseSrc = this.responseBody;
        }else if (this.choose1 === "Header"){
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

  getCurrentCreateTaskLists(graphs) {
    let taskCreateLists = [];
    for (let key in graphs) {
      graphs[key].job_id = key;
      taskCreateLists.push(graphs[key]);
    };
    this.taskData.srcData.data = [];
    taskCreateLists.forEach((item, index) => {
      let obj = { job_id: '', project: '' };
      obj.job_id = item.job_id;
      obj.project = item;
      this.taskData.srcData.data.push(obj);
    })

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
      showAnimation: true,
      contentTemplate: content,
      buttons: [],
      onClose: ($event: Event) => {
      }
    });
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

  // 查询任务状态
  onSearch(job_id) {
    this.searchTask(job_id);
  }

  // 清空搜索
  onClear(value) {
    this.searchValue = '';
    this.getTaskslists();
  }

  createTask() {
    let params;
    this.checkedList.splice(0, this.checkedList.length);
    this.checkedList.push(this.selectedProject);
    if (this.checkedList.length > 0) {
      this.checkedList.forEach((item) => {
        // doesnot exist the same name
        let res = false;
        for (let item_displayed of this.tableData.srcData.data) {
          if (item_displayed.job_id === item.job_id) {
            res = true;
            break;
          }
        }
        if (!res && item) {
          params = {
            job_id: item.job_id,
            graph: {
              flow: {
                desc: item.project.desc,
              },
              driver: {
                "skip-default": item.project.skipDefault,
                dir: item.project.dirs,
              },
              profile: {
                profile: item.project.settingPerfEnable,
                trace: item.project.settingPerfTraceEnable,
                session: item.project.settingPerfSessionEnable,
                dir: item.project.settingPerfDir,
              },
              graph: {
                graphconf: item.project.dotSrc,
                format: "graphviz",
              },
            }
          }

          params["graph_name"] = params["job_id"];
          params["job_graph"] = params["graph"];
          this.createTaskResult(params);
        } else {
          if (!this.dialog) {
            const results = this.dialogService.open({
              id: 'dialog-service',
              width: '346px',
              maxHeight: '600px',
              title: '',
              content: this.i18n.getById('message.taskWithTheSameNameHasAlreadyBeenExisted') + ": " + item.job_id,
              backdropCloseable: true,
              dialogtype: 'failed',
              buttons: [
                {
                  cssClass: 'primary',
                  text: 'Ok',
                  handler: ($event: Event) => {
                    results.modalInstance.hide();
                    results.modalInstance.zIndex = -1;
                    this.dialog = false;
                  },
                }
              ],
            });
            this.dialog = true;
          }
        }
      })
    }
  }

  // 创建任务调用接口
  createTaskResult(option) {
    this.basicService.createTask(option)
      .subscribe((data: any) => {
        if (data) {
          if (data.status === 201) {
            const results = this.dialogService.open({
              id: 'task-create-success',
              width: '346px',
              maxHeight: '600px',
              title: '',
              content: this.i18n.getById("message.taskHasBeenCreatedSuccessfully"),
              backdropCloseable: true,
              dialogtype: 'success',
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
          }
        }
        this.getTaskslists();
      },
        error => {
          if (error.error instanceof String) {
            const results = this.dialogService.open({
              id: 'task-error',
              width: '346px',
              maxHeight: '600px',
              title: '',
              content: error.error,
              backdropCloseable: true,
              dialogtype: 'failed',
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
          }
        },
        () => {
          //创建任务成功与否， 都应清空checkedList
          this.checkedList = [];
        })
  }

  // 获取任务列表
  public getTaskslists() {
    this.basicService.getTaskLists().subscribe((data: any) => {
      //
      this.tableData.srcData.data = this.tasksListparse(data.job_list);
    },
      (error) => {
        this.tableData.srcData.data.forEach(item => {
          item.job_status_value = TaskStatus.UNKNOWN;
        })
        this.util.messageShow('获取列表数据失败', 'error');
      })
  }

  // 删除任务
  deleteData(row: any) {
    this.currentRow = row;
    const results = this.dialogService.open({
      id: 'management-delete',
      width: '400px',
      showAnimation: true,
      title: this.i18n.getById('toolBar.deleteDialogButton'),
      backdropCloseable: true,
      dialogtype: 'standard',
      content: this.i18n.getById('management.doYouWantToDeleteThisRecord?'),
      buttons: [{
        cssClass: 'danger',
        text: this.i18n.getById('modal.okButton'),
        disabled: false,
        handler: ($event: Event) => {
          results.modalInstance.hide();
          results.modalInstance.zIndex = -1;
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
        },
      },],
    });
  }

  // 错误码解析
  private errorParse(option) {
    switch (option.error_code) {
      case 'MODELBOX_001':
        return ErrorCode.MODELBOX_001;
      case 'MODELBOX_002':
        return ErrorCode.MODELBOX_002;
      case 'MODELBOX_003':
        return ErrorCode.MODELBOX_003;
      case 'MODELBOX_004':
        return ErrorCode.MODELBOX_004;
      case 'MODELBOX_005':
        return ErrorCode.MODELBOX_005;
      case 'MODELBOX_006':
        return ErrorCode.MODELBOX_006;
    }
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
        if (data && data.status === 204) {
          const results = this.dialogService.open({
            id: 'task-delete-success',
            width: '346px',
            maxHeight: '600px',
            title: '',
            content: this.i18n.getById('management.taskHasBeenDeletedSuccessfully'),
            backdropCloseable: true,
            dialogtype: 'success',
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
      },
        (error) => error => {
          const results = this.dialogService.open({
            id: 'task-delete-fail',
            width: '346px',
            maxHeight: '600px',
            title: '',
            content: this.i18n.getById('management.failToDeleteTask'),
            backdropCloseable: true,
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

  // 搜索任务状态
  private searchTask(option) {
    this.basicService.searchTask(option)
      .subscribe(data => {
        this.tableData.srcData.data = this.tasksListparse(data.job_list);
      },
        error => {
          const results = this.dialogService.open({
            id: 'task-query-fail',
            width: '346px',
            maxHeight: '600px',
            title: '',
            content: this.i18n.getById('management.failToQueryTask'),
            backdropCloseable: true,
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
        })
  }
}
