import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OAuthService} from "angular-oauth2-oidc";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private readonly oAuthService: OAuthService, private http: HttpClient) {
  }

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //
  //   if (request.url.includes('openid-configuration')) {
  //     return next.handle(request);
  //   }
  //   const userToken = this.oAuthService.getAccessToken();
  //   console.log(userToken);
  //   const tokenOnSet = 'C8Plv9rj7Y49t1bpa9K3h1nNNROEJE';
  //   localStorage.setItem("jwt",tokenOnSet);
  //   const token: string | null = localStorage.getItem('jwt');
  //   // const lang: string | null = localStorage.getItem('language');
  //
  //   if (token) {
  //     request = request.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //   }
  //   return next.handle(request);
  // }
  AuthData: string = null;
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('openid-configuration') || request.url.includes('accounts/login/')) {
      return next.handle(request);
    }
    if (request.url.includes('auth-social/convert-token')) {
      const modifiedReq = request.clone();
      return next.handle(modifiedReq);
    }
    const authData = localStorage.getItem('authData');
    if (authData) {
      const modifiedReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authData}`),
      });
      return next.handle(modifiedReq);
    }
    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {
      const modifiedReq = request.clone({
        headers: request.headers.set('Authorization', `Token ${jwtToken}`),
      });
      return next.handle(modifiedReq);
    }
    return next.handle(request);
  }
}
