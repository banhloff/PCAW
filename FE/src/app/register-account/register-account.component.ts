import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LocalService} from "../service/local.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
import {RegisterService} from "../service/register.service";

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.scss']
})
export class RegisterAccountComponent implements OnInit {
  registerForm: FormGroup;
  isLoggedin?: boolean = false;
  isShowPassword: boolean = true;
  userToken: string;
  public showPassword: boolean;
  isloading: boolean = false;


  constructor(private formBuilder: FormBuilder, private localService: LocalService, private registerService: RegisterService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router) {

  }

  showHidePassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$'), Validators.required]],
      email: [null, [Validators.email, Validators.required]],
    });
  }

  setBodyRequest() {
    return {
      username: this.registerForm.get('userName').value,
      password: this.registerForm.get('password').value,
      email: this.registerForm.get('email').value
    }
  }

  reqgister() {
    if (this.registerForm.invalid) {
      const value = this.findInvalidControls();
      if (value[0] == 'password') {
        this.toastr.error('password must have Upper case, digit number, between 8 - 32 character ', 'Notification')
        return;
      }
      this.toastr.error('invalid ' + value[0], 'Notification');
      return;
    } else {
      this.isloading = true
      this.registerService.register(this.setBodyRequest()).subscribe(res => {
        this.isloading = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Register Successfully',
          text: 'Register Succeeded! Check Email for Confirmation!',
          showConfirmButton: false,
          timer: 2000
        })
        this.router.navigate(['/login'])
      }, error => {
        this.isloading = false;
        if (error.error.message == 'Email Is Already Used!') {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Email already register please recheck',
            showConfirmButton: false,
            timer: 2000
          })
          return;
        }
        if (error.error.username[0] === 'A user with that username already exists.') {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Account already exists',
            showConfirmButton: false,
            timer: 2000
          })
          return;
        } else if (error.error.password[0] === 'This value does not match the required pattern.') {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'This value does not match the required pattern.',
            showConfirmButton: false,
            timer: 2000
          })
          return;
        }
      })
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.registerForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
}
