import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogService} from "../../service/dialog.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {CommonUtils} from "../../shared/services/common-utils.service";

@Component({
  selector: 'app-dialog-add-class',
  templateUrl: './dialog-add-class.component.html',
  styleUrls: ['./dialog-add-class.component.css']
})
export class DialogAddClassComponent implements OnInit {
  public submitForm: FormGroup;
  lstClass: any;
  userName: any;
  email: any;

  constructor(
    public dialogRef: MatDialogRef<DialogAddClassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogService: DialogService,
    private form: FormBuilder,
    private toastr: ToastrService,
    private route: Router
  ) {
  }

  ngOnInit(): void {
    this.submitForm = this.form.group({
      classCode: [null, [Validators.maxLength(11), Validators.required]],
      class: [null, [Validators.required]]
    });
    this.lstClass= this.data.lstClass;
    const user = JSON.parse(localStorage.getItem('yser'))
    this.userName = CommonUtils.isNullOrEmptyReturn(user.first_name) + '' + CommonUtils.isNullOrEmptyReturn(user.last_name)
    this.email = CommonUtils.isNullOrEmptyReturn(user.email);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onDismiss() {
    this.dialogRef.close(false);
  }

  setBodyRequest() {
    return {
      enroll_code: this.submitForm.get('classCode').value,
    }
  }

  joinClass() {
    if (this.submitForm.invalid) {
      const value = this.findInvalidControls();
      this.toastr.error('invalid ' + value[0], 'Notification');
      return;
    } else {
      const classId = this.submitForm.get('class').value
      this.dialogService.enrollClass(this.setBodyRequest(), classId).subscribe(res => {
        if (res.message == 'Enroll Succeeded!') {
          Swal.fire({
            position: 'center', icon: 'success', title: 'Enroll Succeeded!', showConfirmButton: false, timer: 1500
          })
          this.dialogRef.close(true);
        } else if (res.message == 'Enroll Failed!') {
          Swal.fire({
            position: 'center', icon: 'error', title: 'Enroll Failed!', showConfirmButton: false, timer: 1500
          })
        }
      }, error => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Enroll Failed!',
          validationMessage: 'askcdskadcn',
          showConfirmButton: false,
          timer: 1500
        })
      });
    }
  }

  private findInvalidControls() {
    const invalid = [];
    const controls = this.submitForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

}
