import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {GoogleApiService, UserInfo} from "../../service/google-api.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-auth', template: '',
})
export class AuthGuards implements OnInit {
  userInfo: UserInfo

  constructor(private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private readonly googleAuthService: GoogleApiService,
              private route: ActivatedRoute, private router: Router
  ) {

  }

  ngOnInit(): void {
   this.googleAuthService.signInGoogle();
  }
}
