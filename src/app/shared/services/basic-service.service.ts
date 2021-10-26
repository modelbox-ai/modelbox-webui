import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BasicServiceService {
  public serviceRouter = '';
  constructor(private http: HttpClient) {
    this.serviceRouter = '';
    this.http = http;
  }

  //请求数据
  queryData(paramData?: any): Observable<any> {
    return this.http.put<any>(this.serviceRouter + '/editor/flow-info', paramData).pipe(timeout(30000))
  }

  queryManagementData(paramData?: string): Observable<any> {
    return this.http.get(this.serviceRouter + '/'+paramData).pipe(timeout(30000))
  }

  queryTaskListData(paramData?: string): Observable<any> {
    return this.http.get(this.serviceRouter + '/console/rest/taskListData'+paramData).pipe(timeout(30000))
  }

  // 创建任务
  queryCreateTask(paramData?: string): Observable<any> {
    return this.http.put(this.serviceRouter + '/v1/modelbox/job', paramData).pipe(timeout(30000))
  }

  // 查询任务列表
  getTaskLists(): Observable<any> {
    return this.http.get(this.serviceRouter + '/v1/modelbox/job/list/all').pipe(timeout(30000))
  }

  // 删除任务
  deleteTask(params?: string): Observable<any> {
    return this.http.delete(this.serviceRouter + '/v1/modelbox/job/list/'+params).pipe(timeout(30000))
  }

  querySolutionList(paramData?: any): Observable<any> {
    return this.http.get(this.serviceRouter + '/editor/solution', paramData).pipe(timeout(30000))
  }

  querySolution(params?: string): Observable<any> {
    
    return this.http.get(this.serviceRouter + '/editor/solution/'+params).pipe(timeout(30000))
  }

  // 查询任务状态
  searchTask(params?: string): Observable<any> {
    return this.http.get(this.serviceRouter + '/v1/modelbox/job/'+params).pipe(timeout(30000))
  }
}