import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {CommonUtils} from "../../../../shared/services/common-utils.service";
import Swal from "sweetalert2";
import {AdminService} from "../../service/admin.service";

@Component({
  selector: 'app-dialog-edit-teacher',
  templateUrl: './dialog-edit-teacher.component.html',
  styleUrls: ['./dialog-edit-teacher.component.scss']
})
export class DialogEditTeacherComponent implements OnInit {
  public submitForm: FormGroup;
  userName: any;
  email: any;

  constructor(
    public dialogRef: MatDialogRef<DialogEditTeacherComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private form: FormBuilder,
    private toastr: ToastrService,
    private route: Router,
    private adminService:AdminService
  ) {
  }

  ngOnInit(): void {
    this.submitForm = this.form.group({
      TEACHER_CODE: [null, [Validators.maxLength(11), Validators.required]],
      SUBJECT: [null, [Validators.required]],
      FIRST_NAME: [null, [Validators.required]],
      LAST_NAME: [null, [Validators.required]],
      CLASS: [null, [Validators.required]],
      EMAIL: [null, [Validators.required]],
    });
    const user = this.data.id;
    const student_subject = this.data.id.teaches_subjects;
    const student_class = this.data.id.teaches_classes;
    const lst_sub = student_subject.map((res: any) => {
      return res.id;
    })
    const lst_class = student_class.map((res: any) => {
      return res.id;
    })
    this.submitForm.get('TEACHER_CODE').setValue(user.profile.code);
    this.submitForm.get('EMAIL').setValue(user.email);
    this.submitForm.get('SUBJECT').setValue(lst_sub);
    this.submitForm.get('CLASS').setValue(lst_class);
    this.submitForm.get('FIRST_NAME').setValue(CommonUtils.isNullOrEmptyReturn(user.first_name));
    this.submitForm.get('LAST_NAME').setValue(CommonUtils.isNullOrEmptyReturn(user.last_name));
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onDismiss() {
    this.dialogRef.close(false);
  }

  setBodyRequest() {
    return {
      code: this.submitForm.get('TEACHER_CODE').value,
      teaches_subjects: this.submitForm.get('SUBJECT').value,
      first_name: this.submitForm.get('FIRST_NAME').value,
      last_name: this.submitForm.get('LAST_NAME').value,
      teaches_classes: this.submitForm.get('CLASS').value,
      email: this.submitForm.get('EMAIL').value,
    }
  }
  setBodyProfile() {
    return {
      code: this.submitForm.get('TEACHER_CODE').value
    }
  }

  update() {
    if (this.submitForm.invalid) {
      const value = CommonUtils.findInvalidControls(this.submitForm);
      this.toastr.warning('invalid ' + value[0].replace('_', ' '), 'Notification');
      return;
    } else {
      this.adminService.updateUserProfile(this.setBodyProfile(),this.data.id.id).subscribe(res=>{
        console.log(res)
      })
      this.adminService.updateAccountTeacher(this.setBodyRequest(),this.data.id.id).subscribe(res=>{
        if(res.message === "Partial Update Succeeded!"){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Teacher Update Successfully',
            showConfirmButton: false,
            timer: 2000
          })
          console.log(res)
          this.dialogRef.close(true);
        }
      },error =>    Swal.fire({
        position: 'center',
        icon: 'error',
        title: ' Update error',
        showConfirmButton: false,
        timer: 2000
      }))
    }
  }


}
