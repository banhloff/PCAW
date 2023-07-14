import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {GoogleApiService, UserInfo} from "../../service/google-api.service";
import {LoginSocialService} from "../../service/login-social.service";
import {LocalService} from "../../service/local.service";
import {HelperService} from "../../shared/services/helper.service";

@Component({
  selector: 'app-login', templateUrl: './login.component.html', styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoggedin?: boolean = false;
  isShowPassword: boolean = true;
  public showPassword: boolean;

  constructor(private formBuilder: FormBuilder,public helper:HelperService, private localService: LocalService, private toastr: ToastrService, private readonly googleAuthService: GoogleApiService, private route: ActivatedRoute, private router: Router, private loginSocialService: LoginSocialService) {
    // googleAuthService.userProfileSubject.subscribe( info => {
    //   this.userInfo = info
    // })
  }

  ngOnInit() {
    this.helper.APP_SHOW_PROCESSING.next(false);

    this.loginForm = this.formBuilder.group({
      userName: [null, [Validators.required]], password: [null, [Validators.required]],
    });

  }

  userToken: string;
  setBodyRequest(){
    return{
      username:this.loginForm.get('userName').value,
      password:this.loginForm.get('password').value
    }
  }
  login() {
    if (this.loginForm.invalid) {
      const value = this.findInvalidControls();
      this.toastr.error('invalid ' + value[0], 'Notification');
      return;
    } else {
      this.loginSocialService.login(this.setBodyRequest()).subscribe(res => {
       this.helper.APP_SHOW_PROCESSING.next(true);
        if (res.token && res.user.is_active) {
          this.userToken = res.token
          localStorage.setItem('jwt', res.token);
          localStorage.setItem('userId', res.user.id);
          localStorage.setItem('userName', res.user.username);
          if(res.user.is_staff && res.user.is_superuser){
            localStorage.setItem('role', 'isAdmin');
          }else {
            localStorage.setItem('role', res.user.groups[0].name);
          }
          localStorage.setItem('yser', JSON.stringify(res.user));
          if (this.userToken) {
            this.helper.APP_SHOW_PROCESSING.next(false);
            Swal.fire({
              position: 'center', icon: 'success', title: 'login successfully', showConfirmButton: false, timer: 1500
            })
            this.router.navigate(['']);
            this.helper.APP_SHOW_PROCESSING.next(false);
          }
          // this.localService.saveData('role',res.user.groups);
        } else {
          Swal.fire({
            position: 'center', icon: 'error', title: 'login failed please try again', showConfirmButton: false, timer: 1000
          })
        }
      }, error => Swal.fire({
        position: 'center', icon: 'error', title: 'login failed please try again', showConfirmButton: false, timer: 1000
      }))
    }
  }
  userInfo?: UserInfo
  loginWithGoogle(): void {
  this.googleAuthService.signInGoogle();
    if(this.googleAuthService.isLoggedIn()){
      this.router.navigate(['']);
    }
  }
  logOut(): void {
    this.googleAuthService.signOut();
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.loginForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  showHidePassword() {
    this.showPassword = !this.showPassword;
  }
}
