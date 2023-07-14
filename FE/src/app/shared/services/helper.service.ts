import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  public APP_TOAST_MESSAGE = new BehaviorSubject<any>([]);
  public APP_CONFIRM_DELETE = new BehaviorSubject(null);
  public APP_SHOW_HIDE_LEFT_MENU = new BehaviorSubject<any>([]);
  public APP_SHOW_PROCESSING = new BehaviorSubject<any>([]);

  constructor() {}

  /**
   * createMessage
   * param data
   */
  processReturnMessage(data:any) {
    this.APP_TOAST_MESSAGE.next(data);
  }

  /**
   * processing
   * param data
   */
  isProcessing(isProcessing: boolean) {
    this.APP_SHOW_PROCESSING.next(isProcessing);
  }

  /**
   * confirmDelete
   * param data
   */
  confirmDelete(data:any) {
    this.APP_CONFIRM_DELETE.next(data);
    // this.APP_CONFIRM_DELETE.pipe(data);
  }

  refreshConfirmDelete() {
    this.APP_CONFIRM_DELETE = new BehaviorSubject({});
  }
}
