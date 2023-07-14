import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {HelperService} from "../../shared/services/helper.service";
import {BasicService} from "../../service/basic.service";
import {environment} from "../../enviroment/enviroment";

@Injectable({
  providedIn: 'root'
})
export class TeacherService extends BasicService {
  serviceUrl: string;

  constructor(public override helperService: HelperService, public override httpClient: HttpClient) {
    super(httpClient, helperService);
    this.serviceUrl = environment.apiUrl + environment.BASEAPIPATH.URL;

  }

  public showSpinner: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public getAllclass(): Observable<any> {
    this.showSpinner.next(true);
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + 'classes/yours/';
    return this.getRequest(url);
  }

  public createClass(body: any): Observable<any> {
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + 'classes/';
    return this.postRequest(url, body);
  }

  public getAllSemester(): Observable<any> {
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + 'semesters/';
    return this.getRequest(url);
  }

  public getAllSubject(): Observable<any> {
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + 'subjects/';
    return this.getRequest(url);
  }

  public importStudent(data: any, id: any): Observable<any> {
    let body = new FormData();
    body.append('file', data);
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + `classes/${id}/import/`;
    return this.postRequest(url,body);
  }

  getClassDetails(id: any) {
    this.showSpinner.next(true);
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + `classes/${id}/assignments/`
    return this.getRequest(url);
  }

  public getAllClassStudentById(id:any): Observable<any> {
    this.showSpinner.next(true);
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + `classes/${id}/`;
    return this.getRequest(url);
  }
  public getStudentSubmitAss(id:any): Observable<any> {
    this.showSpinner.next(true);
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + `assignments/${id}/submissions/`;
    return this.getRequest(url);
  }
  public addAssignment(body: any): Observable<any> {
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + 'assignments/';
    return this.postRequest(url, body);
  }
  public editAssignment(body: any,ids:any): Observable<any> {
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + `assignments/${ids}/`;
    return this.putRequest(url, body);
  }

  public getAssignmentDetail(ids: any): Observable<any> {
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + `assignments/${ids}`;
    return this.getRequest(url);
  }

  public deleteAssignment(ids: any): Observable<any> {
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + `assignments/${ids}/`;
    return this.deleteRequest(url);
  }

  public deleteSubmitionUser(ids: any): Observable<any> {
    const url = this.serviceUrl + `submissions/${ids}/`;
    const body = {is_deleted: true}
    return this.patchRequestNoLoad(url, body);
  }


  updateAccountStudent(body: any, id: any) {
    const url = this.serviceUrl + `accounts/${id}/`;
    return this.patchRequestNoLoad(url, body);
  }

  updateUserProfile(body: any, id: any) {
    const url = this.serviceUrl + `userprofiles/${id}/`;
    return this.putRequestNoLoad(url, body);
  }

  checkPlarism(id: any) {
    const url = this.serviceUrl + `submissions/${id}/checker`;
    return this.getRequestNoLoad(url);
  }
  getSubmitionbyId(id: any) {
    const url = this.serviceUrl + `submissions/${id}`;
    return this.getRequestNoLoad(url);
  }
}
