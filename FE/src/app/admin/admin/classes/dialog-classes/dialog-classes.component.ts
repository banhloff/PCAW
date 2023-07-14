import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {TeacherService} from "../../../../Teacher/service/teacher.service";
import {AdminService} from "../../service/admin.service";
import {langs} from "../../../../shared/enum/langs";
import {HelperService} from "../../../../shared/services/helper.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import Swal from "sweetalert2";

@Component({
  selector: 'app-dialog-classes',
  templateUrl: './dialog-classes.component.html',
  styleUrls: ['./dialog-classes.component.scss']
})
export class DialogClassesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public submitForm: FormGroup;
  userName: any;
  email: any;

  lstTeacher: any;
  id: any;
  lstSemester: any;
  lstLangs = langs;
  lstSubject: any;
  oldlstStudent: any;
  isLoading: boolean;
  displayedColumns: string[] = ['select', 'STUDENTCODE', 'NAME', 'EMAIL'];
  data: MatTableDataSource<any>;
  resultsLength: any;
  LengthTotal: any;
  selection = new SelectionModel<any>(true, []);

  constructor(
    private form: FormBuilder,
    private toastr: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private adminService: AdminService,
    public helper: HelperService
  ) {
    this.predata()
  }

  setBodyRequest() {
    return {
      name: this.submitForm.get('NAME').value,
      code: this.submitForm.get('CODE').value,
      enroll_code: this.submitForm.get('ENROLL_CODE').value,
      semester: this.submitForm.get('SEMESTER').value,
      instructor: this.submitForm.get('INSTRUCTOR').value,
      subject: this.submitForm.get('SUBJECT').value,
      students: this.selection.selected.map(res => res.id),
      langs: [this.submitForm.get('LANGS').value],
    }
  }

  update() {
    if (this.submitForm.invalid) {
      const value = this.findInvalidControls();
      this.toastr.warning('invalid ' + value[0].replace('_', ' '), 'Notification');
      return;
    } else {
      this.adminService.updateClass(this.setBodyRequest(), this.id).subscribe(res => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Update Class successfully',
          showConfirmButton: false,
          timer: 2000
        })
        this.route.navigate(['admin/class-list'])
      }, error => Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error update Class',
        showConfirmButton: false,
        timer: 2000
      }))
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.data.data.forEach(row => this.selection.select(row));
  }

  ngOnInit(): void {
    this.submitForm = this.form.group({
      SUBJECT: [null, [Validators.required]],
      CODE: [null, [Validators.required]],
      NAME: [null, [Validators.required]],
      ENROLL_CODE: [null, [Validators.required]],
      INSTRUCTOR: [null, [Validators.required]],
      SEMESTER: [null, [Validators.required]],
      LANGS: [null, [Validators.required]],
      STUDENT: [null, [Validators.required]],
    });
    this.id = this.router.snapshot.paramMap.get('id');
    this.isLoading = true
    this.adminService.getAllclassbyId(this.id).subscribe(res => {
      this.isLoading = false;
      this.submitForm.get('CODE').setValue(res.code);
      this.submitForm.get('NAME').setValue(res.name);
      this.submitForm.get('ENROLL_CODE').setValue(res.enroll_code);
      this.submitForm.get('INSTRUCTOR').setValue(res.instructor.id);
      this.submitForm.get('SUBJECT').setValue(res.subject.id);
      this.submitForm.get('SEMESTER').setValue(res.semester.id);
      this.submitForm.get('LANGS').setValue(res.langs[0].id);
      this.submitForm.get('STUDENT').setValue(res.students);
      this.oldlstStudent = res.students
      this.fetchData();
    })
  }

  fetchData() {
    this.adminService.getLstAllStudent().subscribe(res => {
        this.isLoading = false;
        this.data = new MatTableDataSource(res.students);
        this.data.paginator = this.paginator;
        this.data.data.filter(o1 => {
          if (this.oldlstStudent.some((o2: any) => o1.id === o2.id)) {
            this.selection.select(o1)
          }
        });

      }, error => this.isLoading = false
    );
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

  private predata() {
    this.adminService.getAllSemester().subscribe(res => {
      this.lstSemester = res.results
    })
    this.adminService.getAllSubject().subscribe(res => {
      this.lstSubject = res.results
    })
    this.adminService.getAllTeacher().subscribe(res => {
      this.lstTeacher = res.teachers
    })
  }
}
