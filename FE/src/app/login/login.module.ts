import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OAuthModule} from "angular-oauth2-oidc";
import {HttpClientModule} from "@angular/common/http";
import {LoginRoutingModule} from "./login-routing.module";
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OAuthModule.forRoot(),
    HttpClientModule,LoginRoutingModule,
  ]
})
export class LoginModule {
}
