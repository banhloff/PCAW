import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {GoogleApiService} from "../../service/google-api.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-Signout', template: '',
})
export class SignoutComponent implements OnInit {
  ngOnInit(): void {
  }

  constructor(private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private readonly googleAuthService: GoogleApiService,
              private route: ActivatedRoute, private router: Router
  ) {
    googleAuthService.signOut();
  }
}
