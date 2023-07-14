import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../enviroment/enviroment";
import {HttpClient} from "@angular/common/http";
import {HelperService} from "../shared/services/helper.service";
import {BasicService} from "../service/basic.service";

@Injectable({
  providedIn: 'root'
})
export class StudentApiService extends BasicService {
  serviceUrl: string;

  constructor(public override helperService: HelperService, public override httpClient: HttpClient) {
    super(httpClient, helperService);
    this.serviceUrl = environment.apiUrl + environment.BASEAPIPATH.URL;

  }

  getAllclass(): Observable<any> {
    const url = this.serviceUrl + `classes/yours/?paging=false`
    return this.getRequest(url);
  }

  getClassDetails(id: any): Observable<any> {
    const url = this.serviceUrl + `classes/${id}/assignments/`
    return this.getRequest(url);
  }

  getAssignmentDetails(id: any): Observable<any> {
    const url = this.serviceUrl + `assignments/${id}/`
    return this.getRequest(url);
  }

  submitSubmition(body: any) {
    const url = this.serviceUrl + `submissions/`
    return this.postRequestNoLoad(url,body);
  }


}
