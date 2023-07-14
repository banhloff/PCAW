import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FooterComponent} from "./shared/footer/footer.component";
import {MatButtonModule} from "@angular/material/button";
import {PageNotFoundComponent} from "./shared/pageNotFound/pageNotFound.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {SidebarComponent} from "./shared/sidebar/sidebar.component";
import {MatListModule} from '@angular/material/list';
import {LoginComponent} from './login/loginComponent/login.component';
import {HomelayoutComponent} from "./homelayout/homelayout/homelayout.component";
import {SharedModule} from "./shared/shared.module";
import {ToastrModule} from 'ngx-toastr';
import {JwtInterceptor} from "./core/helpers/jwt.interceptor";
import {ErrorInterceptor} from "./core/helpers/error.interceptor";
import {AuthExpiredInterceptor} from "./core/helpers/auth-expired.interceptor";
import {OAuthModule} from "angular-oauth2-oidc";
import {SignoutComponent} from "./login/loginComponent/logout.component";
import {NgxSpinnerModule} from "ngx-spinner";
import { RegisterAccountComponent } from './register-account/register-account.component';
import {DndDirective} from "./directive/dnd.directive";
import {NuMonacoEditorModule} from "@ng-util/monaco-editor";
import {NgxEditorModule} from "ngx-editor";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    FooterComponent,
    PageNotFoundComponent,
    SidebarComponent,DndDirective,
    LoginComponent, HomelayoutComponent, SignoutComponent, RegisterAccountComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthExpiredInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatListModule,
    MatToolbarModule,
    AppRoutingModule,
    MatSidenavModule,
    NgxSpinnerModule,
    ToastrModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSlideToggleModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    SharedModule,
    MatDialogModule,
    NgxEditorModule,
    MatInputModule, OAuthModule.forRoot(), HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right'
    }),
    NuMonacoEditorModule.forRoot(),
     ReactiveFormsModule
  ],
})
export class AppModule {}
