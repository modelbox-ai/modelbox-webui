import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";

// 消息中转服务
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public editDataDetails: any = [];
  public subject = new Subject<any>();
  private messageSource = new BehaviorSubject(this.editDataDetails);
  currentMessage = this.messageSource.asObservable();

  changeMessage(message: string) {
    this.messageSource.next(message)
  }
}
