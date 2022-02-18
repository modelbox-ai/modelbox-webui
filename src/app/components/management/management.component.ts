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

import { Component, TemplateRef, OnInit, Input } from '@angular/core';
import { I18nService } from '@core/i18n.service';
import { BasicServiceService } from '@shared/services/basic-service.service';
import { ErrorCode, TaskStatus } from '@shared/constants';
import { DialogService } from 'ng-devui/modal';
import { translate } from '@angular/localize/src/translate';
import { CommonUtils } from '@shared/utils';
import { TableWidthConfig } from 'ng-devui/data-table';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.less'],
})
export class ManagementComponent implements OnInit {
  page = "task";
  folded: boolean = false;
  checkedList: Array<any> = [];
  createTasklists: any;
  refresh_timer: any;
  addTaskData: Array<any> = [];
  newTaskText: string = this.i18n.getById('tasklist.newTask');
  res: any;
  tableData: any = { srcData: { data: [] } }
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

  sreachValue: string = '';
  placeholder: string = this.i18n.getById('tasklist.searchBarPlaceHolder')
  @Input() collapsed: boolean;
  @Input() isSupportFold: boolean = true;
  @Input() graphs: any = JSON.parse(localStorage.getItem('graphs')) || {};
  selectedProject: any;
  dialog: boolean = false;

  constructor(
    private dialogService: DialogService,
    private i18n: I18nService,
    private basicService: BasicServiceService,
    private util: CommonUtils) { }

  ngOnInit(): void {
    this.getTaskslists();
    this.refresh_timer = setInterval(() => { this.getTaskslists(); }, 5000);
  }

  ngOnDestroy(): void {
    if (this.refresh_timer) {
      clearInterval(this.refresh_timer);
      this.refresh_timer = null;
    }
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
    this.sreachValue = '';
    this.getTaskslists();
  }

  // 创建任务modal
  openCreateTask(content: TemplateRef<any>) {
    this.getCurrentCreateTaskLists(this.graphs);
    const results = this.dialogService.open({
      id: this.i18n.getById('modal.createTaskModal'),
      width: '550px',
      showAnimation: true,
      title: this.i18n.getById('modal.createTaskModal'),
      contentTemplate: content,
      backdropCloseable: true,
      dialogtype: 'standard',
      buttons: [{
        cssClass: 'danger',
        text: this.i18n.getById('modal.okButton'),
        disabled: false,
        handler: ($event: Event) => {
          results.modalInstance.hide();
          results.modalInstance.zIndex = -1;
          this.createTask();
        },
      },
      {
        id: 'btn-cancel',
        cssClass: 'common',
        text: this.i18n.getById('modal.cancelButton'),
        handler: ($event: Event) => {
          results.modalInstance.hide();
          results.modalInstance.zIndex = -1;
        },
      },],
    });
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
            job_graph: {
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
  private getTaskslists() {
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
  private deleteTask(option) {

    this.basicService.deleteTask(option.job_id)
      .subscribe(data => {

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
