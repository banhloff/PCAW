import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../enviroment/enviroment";
import {catchError, Observable, throwError, timeout} from "rxjs";
import {HelperService} from "../shared/services/helper.service";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LoginSocialService {
  serviceUrl: string;

  constructor(public http: HttpClient, private helperService: HelperService) {
    this.serviceUrl = environment.apiUrl + environment.BASEAPIPATH.URL;
  }

  login(req: any): Observable<any> {
    const url = `${this.serviceUrl}accounts/login/`;
    return this.postRequest(url, req);
  }

  public postRequest(url: string, data?: any, options?: any): Observable<any> {
    this.helperService.isProcessing(true);
    return this.http.post(url, data, options).pipe(
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

  public handleError(error: any) {
    // const errorMsg = (error.message) ? error.message :
    //   error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(error);
  }

  save(body: any): Observable<any> {
    return this.http.post<any>(`${this.serviceUrl}create`, body);
  }

  update(body: any): Observable<any> {
    return this.http.post<any>(`${this.serviceUrl}update`, body);
  }

  getById(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.serviceUrl}${patientId}`);
  }

  delete(medicalRecordId: any, patientId: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('medicalRecordId', medicalRecordId);
    params = params.append('patientId', patientId);
    return this.http.get<any>(`${this.serviceUrl}delete`, {params: params});
  }
}
