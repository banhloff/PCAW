import {HttpClient} from '@angular/common/http';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TeacherService} from "../service/teacher.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {HelperService} from "../../shared/services/helper.service";

@Component({
  selector: 'app-import-class',
  templateUrl: './import-class.component.html',
  styleUrls: ['./import-class.component.scss']
})
export class ImportClassComponent implements ViewChild, OnInit, AfterViewInit {
  displayedColumns: string[] = ['STUDENT_CODE',
    'FIRST_NAME',
    // 'LAST_NAME',
    'EMAIL', 'actions'];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  data: IStudent[] = [];

  descendants: boolean;
  emitDistinctChangesOnly: boolean;
  first: boolean;
  read: any;
  isViewQuery: boolean;
  selector: any;
  static?: boolean | undefined;
  list: any;
  fileUploaded: File;
  lstSemester: any;
  lstSubject: any;
  codeClass: any
  importClass: FormGroup
  files: File;

  ngAfterViewInit() {
  }

  enroll_code: string;

  constructor(public helpservice: HelperService, private rout: Router, private _httpClient: HttpClient, private toastr: ToastrService, private fb: FormBuilder, private teacherService: TeacherService) {
    this.predata();
  }

  predata() {
    this.teacherService.getAllSemester().subscribe(res => {
      this.lstSemester = res.results
    })
    this.teacherService.getAllSubject().subscribe(res => {
      this.lstSubject = res.results
    })
  }

  ngOnInit() {
    this.importClass = this.fb.group({
      className: [null, [Validators.required]],
      codeClass: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      semester: [null, [Validators.required]],
    });
  }

  setBodyRequestCreateClass() {
    return {
      name: this.importClass.get('className').value,
      code: this.importClass.get('codeClass').value,
      is_active: 'true',
      is_open: 'true',
      enroll_code: this.enroll_code,
      semester: this.importClass.get('semester').value,
      instructor: localStorage.getItem('userId'),
      subject: this.importClass.get('subject').value,
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const fileType = file.type;
    console.log(document.getElementById('fileUpload'))
    if (fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      fileType !== 'application/vnd.ms-excel') {
      Swal.fire({
        position: 'center', icon: 'error', title: 'Please choose file xlsx', showConfirmButton: false, timer: 1500
      })
      document.getElementById('fileUpload').nodeValue = ''
      document.getElementById('fileUpload').click()
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {type: 'array'});
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      if (worksheet['!ref'] === undefined) {
        Swal.fire({
          position: 'center', icon: 'error', title: 'this file is empty', showConfirmButton: false, timer: 1500
        })
        document.getElementById('fileUpload').click()
        return;
      }
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {raw: false});
      this.list = jsonData;
      this.list = this.list.filter((ress: any) => {
        return ress.student_code != null && ress.first_name != null && ress.last_name != null && ress.email != null
      })
      if (this.list.length == 0) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Import Failed please recheck file xlsx ',
          showConfirmButton: false,
          timer: 1500
        })
      }
      this.data = this.list.map((res: IStudent) => {
        if (res.first_name != null && res.last_name != null && res.email != null) {
          return <IStudent>{
            student_code: res.student_code,
            first_name: res.first_name,
            last_name: res.last_name,
            email: res.email,
          };
        }else{
          this.toastr.warning('invalid ' + res, 'Notification');
          return null
        }
      });
    };
    if (this.data) {
      Swal.fire({
        position: 'center', icon: 'success', title: 'import successfully', showConfirmButton: false, timer: 1500
      })
      this.files = file
    }
    reader.readAsArrayBuffer(file);
  }
  removeIndex(row: any) {
    this.data = this.data.filter((item, index) => index !== row);
    if (this.data.length == 0) {

    }
  }

  fileOverHandler(event: any) {
    console.log(event);
  }

  onFileDropped(event: any) {
    this.fileUploaded = event[0];
    this.onFileSelected(event);
  }

  onSubmit() {
    if (this.importClass.invalid) {
      const value = this.findInvalidControls();
      this.toastr.error('invalid ' + value[0], 'Notification');
      return;
    } else {
      this.enroll_code = this.makeid();
      this.teacherService.createClass(this.setBodyRequestCreateClass()).subscribe(res => {
        if (res) {
          if (this.files) {
            this.addStudentIntoClass(res.id);
          } else {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Create Class successfully',
              showConfirmButton: false,
              timer: 1500
            })
            this.rout.navigate(['teacher/home'])
          }
        }
      }, error => {
        if (error.status == 400) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Class with this code already exist',
            showConfirmButton: false,
            timer: 1500
          })
          return
        }
        Swal.fire({
          position: 'center', icon: 'error', title: 'ERROR CREATE CLASS', showConfirmButton: false, timer: 1500
        })
      })
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.importClass.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  makeid() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 6) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  private addStudentIntoClass(id: any) {
    if (this.files) {
      this.teacherService.importStudent(this.files, id).subscribe(res => {
        if (res.message = 'Upload Successfull') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Upload Successfully',
            showConfirmButton: false,
            timer: 1500
          })
          this.rout.navigate(['teacher/home'])
        }
      }, error => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Upload Failed',
          showConfirmButton: false,
          timer: 1500
        })
      })
    }
  }
}


export interface IStudent {
  student_code:any;
  first_name: any;
  last_name: any;
  email: any;
}
