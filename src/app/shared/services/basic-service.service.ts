import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BasicServiceService {
  public serviceRouter = '';
  public messageSource = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    this.serviceRouter = '';
    this.http = http;
  }

  private subject = new Subject<any>();
  publish(value: any, err: any) {
    if (value !== undefined) {
      this.subject.next(value);
    }
    if (err !== undefined) {
      this.subject.error(err);
    }
  }

  subscribe(handler: {
    next: (value) => void,
    error: (err) => void,
    complete: () => void
  }) {
    this.subject.asObservable().subscribe(handler);
  }

  customRequest(method, route, paramData?: any, options?: any): Observable<any> {
    let obj = new Object();
    obj['method'] = method;
    obj['url'] = route;
    obj['header'] = JSON.stringify(options);
    obj['body'] = JSON.stringify(paramData);

    return this.http.post("/editor/postman", obj).pipe(timeout(30000));
  }

  //请求数据
  queryData(paramData?: any): Observable<any> {
    return this.http.put<any>(this.serviceRouter + '/editor/flow-info', paramData).pipe(timeout(30000));
  }

  queryManagementData(paramData?: string): Observable<any> {
    return this.http.get(this.serviceRouter + '/' + paramData).pipe(timeout(30000));
  }

  queryTaskListData(paramData?: string): Observable<any> {
    return this.http.get(this.serviceRouter + '/console/rest/taskListData' + paramData).pipe(timeout(30000));
  }

  queryRootPath(): Observable<any> {
    return this.http.get(this.serviceRouter + '/editor/basic-info').pipe(timeout(30000));
  }

  loadTreeByPath(paramData?: string): Observable<any> {
    if (!paramData) {
      paramData = "/"
    }
    return this.http.get(this.serviceRouter + '/editor/project/list/?path=' + paramData).pipe(timeout(30000));
  }

  openProject(paramData?: string): Observable<any> {
    if (!paramData) {
      paramData = "/"
    }
    return this.http.get(this.serviceRouter + '/editor/project/?path=' + paramData).pipe(timeout(30000));
  }

  queryTemplate(): Observable<any> {
    return this.http.get(this.serviceRouter + '/editor/project/template').pipe(timeout(30000));
  }

  // 创建任务
  createTask(paramData?: any): Observable<any> {
    return this.http.put(this.serviceRouter + '/v1/modelbox/job', paramData, { observe: 'response' }).pipe(timeout(30000));
  }

  createProject(paramData?: any): Observable<any> {
    return this.http.put(this.serviceRouter + '/editor/project/create', paramData, { observe: 'response' }).pipe(timeout(30000));
  }

  createFlowunit(paramData?: any): Observable<any> {
    return this.http.put(this.serviceRouter + '/editor/flowunit/create', paramData, { observe: 'response' }).pipe(timeout(30000));
  }

  saveAllProject(paramData?: any): Observable<any> {
    return this.http.put(this.serviceRouter + '/editor/graph', paramData, { observe: 'response' }).pipe(timeout(30000));
  }

  // 查询任务列表
  getTaskLists(): Observable<any> {
    return this.http.get(this.serviceRouter + '/v1/modelbox/job/list/all').pipe(timeout(30000));
  }

  // 删除任务
  deleteTask(params?: string): Observable<any> {
    return this.http.delete(this.serviceRouter + '/v1/modelbox/job/list/' + params).pipe(timeout(30000));
  }

  querySolutionList(paramData?: any): Observable<any> {
    return this.http.get(this.serviceRouter + '/editor/demo', paramData).pipe(timeout(30000));
  }

  querySolution(params?: string): Observable<any> {
    return this.http.get(this.serviceRouter + '/editor/demo/' + params).pipe(timeout(30000));
  }

  // 查询任务状态
  searchTask(params?: string): Observable<any> {
    return this.http.get(this.serviceRouter + '/v1/modelbox/job/' + params).pipe(timeout(30000));
  }
}