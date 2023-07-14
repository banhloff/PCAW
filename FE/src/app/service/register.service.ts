import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {BasicService} from "./basic.service";
import {HttpClient} from "@angular/common/http";
import {HelperService} from "../shared/services/helper.service";
import {environment} from "../enviroment/enviroment";

@Injectable({
  providedIn: 'root'
})
export class RegisterService extends BasicService {
  serviceUrl: string;

  constructor(public override helperService: HelperService, public override httpClient: HttpClient) {
    super(httpClient, helperService);
    this.serviceUrl = environment.apiUrl + environment.BASEAPIPATH.URL;

  }

  register(bodyRequest: any): Observable<any> {
    const url = `${this.serviceUrl}accounts/register/`;
    return this.postRequestNoLoad(url, bodyRequest);
  }
}
