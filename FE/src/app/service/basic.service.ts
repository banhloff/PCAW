import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HelperService} from "../shared/services/helper.service";
import {catchError, Observable, throwError, timeout} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable()
export class BasicService {

  constructor(public httpClient: HttpClient, public helperService: HelperService) {
  }

  public postRequest(url: string, data?: any, options?: any): Observable<any> {
    this.helperService.isProcessing(true);
    return this.httpClient.post(url, data, options).pipe(
      timeout(300000),
      tap(
        // Log the result or error
        res => {
          // this.helperService.APP_TOAST_MESSAGE.next(res);
          this.helperService.isProcessing(false);
        },
        error => {
          // this.helperService.APP_TOAST_MESSAGE.next(error);
          this.helperService.isProcessing(false);
        }
      ),
      catchError(this.handleError)
    );
  }

  public postRequestNoLoad(url: string, data?: any, options?: any): Observable<any> {
    return this.httpClient.post(url, data, options).pipe(
      timeout(300000),
      tap(
        // Log the result or error
        res => {
          // this.helperService.APP_TOAST_MESSAGE.next(res);
        },
        error => {
          // this.helperService.APP_TOAST_MESSAGE.next(error);
        }
      ),
      catchError(this.handleError)
    );
  }
  public patchRequestNoLoad(url: string, data?: any, options?: any): Observable<any> {
    return this.httpClient.patch(url, data, options).pipe(
      timeout(300000),
      tap(
        // Log the result or error
        res => {
          // this.helperService.APP_TOAST_MESSAGE.next(res);
        },
        error => {
          // this.helperService.APP_TOAST_MESSAGE.next(error);
        }
      ),
      catchError(this.handleError)
    );
  }
  public putRequest(url: string, data?: any, options?: any): Observable<any> {
    this.helperService.isProcessing(true);
    return this.httpClient.put(url, data, options).pipe(
      timeout(300000),
      tap(
        // Log the result or error
        res => {
          // this.helperService.APP_TOAST_MESSAGE.next(res);
          this.helperService.isProcessing(false);
        },
        error => {
          // this.helperService.APP_TOAST_MESSAGE.next(error);
          this.helperService.isProcessing(false);
        }
      ),
      catchError(this.handleError)
    );
  }
  public putRequestNoLoad(url: string, data?: any, options?: any): Observable<any> {
    this.helperService.isProcessing(true);
    return this.httpClient.put(url, data, options).pipe(
      timeout(300000),
      tap(
        // Log the result or error
        res => {
          // this.helperService.APP_TOAST_MESSAGE.next(res);
          this.helperService.isProcessing(false);
        },
        error => {
          // this.helperService.APP_TOAST_MESSAGE.next(error);
          this.helperService.isProcessing(false);
        }
      ),
      catchError(this.handleError)
    );
  }
  public deleteRequest(url: string, data?: any): Observable<any> {
    this.helperService.isProcessing(true);
    return this.httpClient.delete(url, data).pipe(
      timeout(300000),
      tap(
        // Log the result or error
        res => {
          // this.helperService.APP_TOAST_MESSAGE.next(res);
          this.helperService.isProcessing(false);
        },
        error => {
          // this.helperService.APP_TOAST_MESSAGE.next(error);
          this.helperService.isProcessing(false);
        }
      ),
      catchError(this.handleError)
    );
  }
  public deleteRequestNoLoad(url: string, data?: any): Observable<any> {
    return this.httpClient.delete(url, data).pipe(
      timeout(300000),
      tap(
        // Log the result or error
        res => {
          // this.helperService.APP_TOAST_MESSAGE.next(res);
        },
        error => {
          // this.helperService.APP_TOAST_MESSAGE.next(error);
        }
      ),
      catchError(this.handleError)
    );
  }
  public handleError(error: any) {
    // const errorMsg = (error.message) ? error.message :
    //   error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(error);
  }

  public getRequest(url: string, options?: any): Observable<any> {
    this.helperService.isProcessing(true);
    return this.httpClient.get(url, options).pipe(
      timeout(300000),
      tap(
        // Log the result or error
        res => {
          // this.helperService.APP_TOAST_MESSAGE.next(res);
          this.helperService.isProcessing(false);
        },
        error => {
          // this.helperService.APP_TOAST_MESSAGE.next(error);
          this.helperService.isProcessing(false);
        }
      ),
      catchError(this.handleError)
    );
  }
  public getRequestNoLoad(url: string, options?: any): Observable<any> {
    return this.httpClient.get(url, options).pipe(
      timeout(300000),
      tap(
        // Log the result or error
        res => {
          // this.helperService.APP_TOAST_MESSAGE.next(res);
        },
        error => {
          // this.helperService.APP_TOAST_MESSAGE.next(error);
        }
      ),
      catchError(this.handleError)
    );
  }
}
