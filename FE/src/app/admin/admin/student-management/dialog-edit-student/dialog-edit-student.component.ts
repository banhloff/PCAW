import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogService} from "../../../../service/dialog.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {CommonUtils} from "../../../../shared/services/common-utils.service";
import Swal from "sweetalert2";
import {TeacherService} from "../../../../Teacher/service/teacher.service";

@Component({
  selector: 'app-dialog-edit-student',
  templateUrl: './dialog-edit-student.component.html',
  styleUrls: ['./dialog-edit-student.component.scss']
})
export class DialogEditStudentComponent implements OnInit {

  public submitForm: FormGroup;
  userName: any;
  email: any;

  constructor(
    public dialogRef: MatDialogRef<DialogEditStudentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private form: FormBuilder,
    private toastr: ToastrService,
    private route: Router,
    private teacherService:TeacherService
  ) {
  }

  ngOnInit(): void {
    this.submitForm = this.form.group({
      STUDENT_CODE: [null, [ Validators.required]],
      SUBJECT: [null, [Validators.required]],
      FIRST_NAME: [null, [Validators.required]],
      LAST_NAME: [null, [Validators.required]],
      CLASS: [null, [Validators.required]],
      EMAIL: [null, [Validators.required]],
    });
    const user = this.data.id;
    const student_subject = this.data.id.studies_subjects;
    const student_class = this.data.id.studies_classes;
    const lst_sub = student_subject.map((res: any) => {
      return res.id;
    })
    const lst_class = student_class.map((res: any) => {
      return res.id;
    })
    this.submitForm.get('STUDENT_CODE').setValue(user.profile.code);
    this.submitForm.get('EMAIL').setValue(user.email);
    this.submitForm.get('SUBJECT').setValue(lst_sub);
    this.submitForm.get('CLASS').setValue(lst_class);
    this.submitForm.get('FIRST_NAME').setValue(CommonUtils.isNullOrEmptyReturn(user.first_name));
    this.submitForm.get('LAST_NAME').setValue(CommonUtils.isNullOrEmptyReturn(user.last_name));
    // this.submitForm.get('SUBJECT').setValue();
    // this.userName = CommonUtils.isNullOrEmptyReturn(user.first_name) + '' + CommonUtils.isNullOrEmptyReturn(user.last_name)
    // this.email = CommonUtils.isNullOrEmptyReturn(user.email);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onDismiss() {
    this.dialogRef.close(false);
  }

  setBodyRequest() {
    return {
      code: this.submitForm.get('STUDENT_CODE').value,
      studies_subjects: this.submitForm.get('SUBJECT').value,
      first_name: this.submitForm.get('FIRST_NAME').value,
      last_name: this.submitForm.get('LAST_NAME').value,
      studies_classes: this.submitForm.get('CLASS').value,
      email: this.submitForm.get('EMAIL').value,
    }
  }

  setBodyProfile() {
    return {
      code: this.submitForm.get('STUDENT_CODE').value
    }
  }

  update() {
    if (this.submitForm.invalid) {
      const value = this.findInvalidControls();
      this.toastr.warning('invalid ' + value[0].replace('_', ' '), 'Notification');
      return;
    } else {
      this.teacherService.updateUserProfile(this.setBodyProfile(),this.data.id.id).subscribe(res=>{
      })
      this.teacherService.updateAccountStudent(this.setBodyRequest(),this.data.id.id).subscribe(res=>{
        if(res.message === "Partial Update Succeeded!"){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Student Update Succeeded',
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
