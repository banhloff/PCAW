import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HelperService} from "../shared/services/helper.service";
import {environment} from "../enviroment/enviroment";
import {BasicService} from "./basic.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DialogService extends BasicService {
  serviceUrl: string;

  constructor(public override helperService: HelperService, public override httpClient: HttpClient) {
    super(httpClient, helperService);
    this.serviceUrl = environment.apiUrl + environment.BASEAPIPATH.URL;
  }

  getAllClassNoPagging(): Observable<any> {
    const url = `${this.serviceUrl}classes/?paging=false`;
    return this.getRequest(url);
  }

  enrollClass(bodyRequest: any, id: any): Observable<any> {
    const url = `${this.serviceUrl}classes/${id}/enroll/`;
    return this.postRequest(url, bodyRequest);
  }
}
