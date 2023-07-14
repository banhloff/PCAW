import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {Observable, Subject} from 'rxjs';
import {Router} from "@angular/router";
import {environment} from "../enviroment/enviroment";
import Swal from "sweetalert2";

const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://accounts.google.com',

  // strict discovery document disallows urls which not start with issuers url
  strictDiscoveryDocumentValidation: false,

  // URL of the SPA to redirect the user to after login
  redirectUri: environment.RedirectUrlGoogle + 'Oauth',

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: '729516394721-fifi036327n9kqtvj6ut2umdbsl7sjhu.apps.googleusercontent.com',

  // set the scope for the permissions the client should request
  scope: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  loginUrl: 'http://widen.dev/Oauth',
  showDebugInformation: true,
};

export interface UserInfo {
  info: {
    sub: string
    email: string,
    name: string,
    picture: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  gmail = ' .com'

  userProfileSubject = new Subject<UserInfo>()

  constructor(private readonly oAuthService: OAuthService, private router: Router, private http: HttpClient) {
    // confiure oauth2 service
    // oAuthService.configure(authCodeFlowConfig);
    // // manually configure a logout url, because googles discovery document does not provide it
    // oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";
    //
    // // loading the discovery document from google, which contains all relevant URL for
    // // the OAuth flow, e.g. login url
    // oAuthService.loadDiscoveryDocument().then(() => {
    //   // // This method just tries to parse the token(s) within the url when
    //   // // the auth-server redirects the user back to the web-app
    //   // // It doesn't send the user the the login page
    //   oAuthService.tryLoginImplicitFlow().then(() => {
    //     console.log(this.oAuthService.getAccessToken())
    //     // when not logged in, redirecvt to google for login
    //     // else load user profile
    //     if (!oAuthService.hasValidAccessToken()) {
    //       oAuthService.initLoginFlow()
    //     } else {
    //       console.log(oAuthService.getAccessToken());
    //       oAuthService.loadUserProfile().then((userProfile) => {
    //         this.userProfileSubject.next(userProfile as UserInfo)
    //       })
    //     }
    //
    //   })
    // });
  }


  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken()
  }

  signOut() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login'])
  }
  AuthData :string = null;

  signInGoogle() {
    console.log('signin')
    this.oAuthService.configure(authCodeFlowConfig);
    // manually configure a logout url, because googles discovery document does not provide it
    this.oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";

    // loading the discovery document from google, which contains all relevant URL for
    // the OAuth flow, e.g. login url
    this.oAuthService.loadDiscoveryDocument().then(() => {
      // // This method just tries to parse the token(s) within the url when
      // // the auth-server redirects the user back to the web-app
      // // It doesn't send the user the the login page
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        console.log(this.oAuthService.getAccessToken())
        // when not logged in, redirecvt to google for login
        // else load user profile
        if (!this.oAuthService.hasValidAccessToken()) {
          this.oAuthService.initLoginFlow()
        } else {
          console.log('valid access token')
          this.authorize()
          // this.oAuthService.loadUserProfile().then((userProfile) => {
          //   this.userProfileSubject.next(userProfile as UserInfo)
          // })
        }
      })
    });
  }
  authorize() {
    const accessToken = this.oAuthService.getAccessToken();
    let req = environment.enviromentConverToken;
    req.token = accessToken;
    this.apiConvertToken(req).subscribe(res => {
      this.AuthData = res.body.access_token
      localStorage.setItem('authData', res.body.access_token)
      this.getUserPermission().subscribe(res => {
        localStorage.setItem('userId', res.id);
        localStorage.setItem('userName', res.username);
        localStorage.setItem('role', res.groups[0].name);
        localStorage.setItem('yser', JSON.stringify(res));
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Login successfully',
          showConfirmButton: false,
          timer: 2000
        })
        this.router.navigate(['']);
      })
    })

  }

  getUserPermission(): Observable<any>  {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${this.AuthData}`)
    }
    return this.http.get(environment.apiUrl +  "api/accounts/user", header);
  }

  apiConvertToken(req: any): Observable<any> {
    const url = environment.apiUrl + 'auth-social/convert-token'
    return this.http.post(url, req, {
      observe: 'response'
    });
  }

  private authHeader(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.AuthData}`
    })
  }
}
