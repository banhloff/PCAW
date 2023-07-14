import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BasicService} from "../../../service/basic.service";
import {HelperService} from "../../../shared/services/helper.service";
import {environment} from "../../../enviroment/enviroment";
import {BehaviorSubject, Observable} from "rxjs";
import {CommonUtils} from "../../../shared/services/common-utils.service";

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BasicService {
  serviceUrl: string;

  constructor(public override helperService: HelperService, public override httpClient: HttpClient) {
    super(httpClient, helperService);
    this.serviceUrl = environment.apiUrl + environment.BASEAPIPATH.URL;
  }
  public showSpinner: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public getDashboard(): Observable<any> {
    this.showSpinner.next(true);
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + 'dashboard/';
    return this.getRequest(url);
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

  public getAllclass(): Observable<any> {
    this.showSpinner.next(true);
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + 'classes/';
    return this.getRequest(url);
  }
  public getAllTeacher(): Observable<any> {
    this.showSpinner.next(true);
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + 'accounts/teachers?paging=false';
    return this.getRequest(url);
  }
  public getAllclassbyId(id:any): Observable<any> {
    this.showSpinner.next(true);
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + `classes/${id}/`;
    return this.getRequest(url);
  }
  public getAllclassNopaging(): Observable<any> {
    this.showSpinner.next(true);
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + 'classes/?paging=false';
    return this.getRequest(url);
  }
  public getLstStudent(page?: any): Observable<any> {
    this.showSpinner.next(true);
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + `accounts/students/?page=${page}`;
    return this.getRequest(url);
  }
  public getLstTeacher(page?: any): Observable<any> {
    this.showSpinner.next(true);
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + `accounts/teachers/?page=${page}`;
    return this.getRequest(url);
  }
  public getLstAllStudent(): Observable<any> {
    const url = this.serviceUrl + `accounts/students/?paging=false`;
    return this.getRequestNoLoad(url);
  }

  public getLstStudentwCondition(body?: any, page?: any): Observable<any> {
    const buildParams = CommonUtils.buildParams(body);
    const url = this.serviceUrl + `accounts/students/?page=${page}`;
    return this.getRequestNoLoad(url, {params: buildParams});
  }
  public getLstTeacherwCondition(body?: any, page?: any): Observable<any> {
    const buildParams = CommonUtils.buildParams(body);
    const url = this.serviceUrl + `accounts/teachers/?page=${page}`;
    return this.getRequestNoLoad(url, {params: buildParams});
  }

  public getLstAllAccountWcondition(body?: any, page?: any): Observable<any> {
    const buildParams = CommonUtils.buildParams(body);
    const url = this.serviceUrl + `accounts/?page=${page}`;
    return this.getRequestNoLoad(url, {params: buildParams});
  }

  public getLstAllaccount(page?: any): Observable<any> {
    this.showSpinner.next(true);
    this.helperService.isProcessing(true);
    const url = this.serviceUrl + `accounts/?page=${page}`;
    return this.getRequest(url);
  }

  public getAllclassbyCondition(body?: any, page?: any): Observable<any> {
    const buildParams = CommonUtils.buildParams(body);
    const url = this.serviceUrl + `classes/?page=${page}`;
    return this.getRequestNoLoad(url, {params: buildParams});
  }

  grantAccessTeacher(id: any) {
    const url = this.serviceUrl + `accounts/${id}/grant-teacher/`;
    return this.postRequestNoLoad(url);
  }
  grantAccessStudent(id: any) {
    const url = this.serviceUrl + `accounts/${id}/grant-student/`;
    return this.postRequestNoLoad(url);
  }
  deleteStudentById(id: any) {
    // api/accounts/(id) - (DELETE)
    const url = this.serviceUrl + `accounts/${id}`;
    return this.deleteRequestNoLoad(url);
  }

  deleteClass(id: any) {
    const url = this.serviceUrl + `classes/${id}/`;
    const body = {is_deleted: true}
    return this.patchRequestNoLoad(url, body);
  }

  updateClass(bodyRequest: any, id: any) {
    const url = this.serviceUrl + `classes/${id}/`;
    return this.patchRequestNoLoad(url, bodyRequest);
  }

  updateAccountTeacher(bodyRequest: any, id:any) {
    const url = this.serviceUrl + `accounts/${id}/`;
    return this.patchRequestNoLoad(url, bodyRequest);
  }

  updateUserProfile(body: any, id:any) {
    const url = this.serviceUrl + `userprofiles/${id}/`;
    return this.putRequestNoLoad(url, body);
  }
}
