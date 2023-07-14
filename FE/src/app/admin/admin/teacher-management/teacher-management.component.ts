import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {HelperService} from "../../../shared/services/helper.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../service/admin.service";
import Swal from "sweetalert2";
import {MatDialog} from "@angular/material/dialog";
import {DialogEditStudentComponent} from "../student-management/dialog-edit-student/dialog-edit-student.component";
import {DialogEditTeacherComponent} from "./dialog-edit-teacher/dialog-edit-teacher.component";

@Component({
  selector: 'app-teacher-management',
  templateUrl: './teacher-management.component.html',
  styleUrls: ['./teacher-management.component.scss']
})
export class TeacherManagementComponent implements OnInit {

  displayedColumns: string[] = ['TEACHERCODE', 'NAME', 'EMAIL', 'SUBJECT', 'CLASS', 'ACTION'];
  data: MatTableDataSource<any>;

  resultsLength = 0;
  LengthTotal = 0;
  isLoadingResults = true;
  isLoading = true;
  isRateLimitReached = false;
  public submitForm: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  id: any;
  className: any;
  langs: any;
  lstSubject: any;
  lstClass: any;
  pageEvent: any;
  length: any;
  pageSize: any;
  pageIndex: any = 1;
  body = {}

  constructor(public helper: HelperService, private form: FormBuilder,
              private _httpClient: HttpClient, public dialog: MatDialog, private router: ActivatedRoute, private route: Router, private adminService: AdminService) {
    this.preData();
  }

  ngOnInit(): void {
    this.submitForm = this.form.group({
      subject: [null],
      class: [null],
      studentCode: [null],
    });
    this.fetchData();
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    // this.isRateLimitReached = false;
    // this.isLoadingResults = false;
  }

  edit(row: any) {
    const dialogRef = this.dialog.open(DialogEditTeacherComponent, {
      height: '450px',
      width: '600px',
      data: {
        id: row,
        lstSubject:this.lstSubject,
        lstClass:this.lstClass
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchData()
      }
    });
  }

  delete(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete Account " + row.profile.code + "?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#45cee0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.helper.APP_SHOW_PROCESSING.next(true);
      }
    })
  }

  fetchData() {
    this.adminService.getLstTeacher(this.pageIndex).subscribe(res => {
        this.isLoading = false;
        this.data = new MatTableDataSource(res.results);
        this.resultsLength = res.results.length;
        this.LengthTotal = res.count;
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;
      }, error => this.isLoading = false
    );
  }

  import() {
    this.route.navigate(['admin/import-class'])
  }

  setbodyRequest() {
    return {
      subjects: this.submitForm.get('subject').value == '' ? null : this.submitForm.get('subject').value,
      classes: this.submitForm.get('class').value == '' ? null : this.submitForm.get('class').value,
      code: this.submitForm.get('studentCode').value == '' ? null : this.submitForm.get('studentCode').value,
    }
  }

  search() {
    this.isLoading = true;
    let req = this.setbodyRequest();
    Object.keys(req).forEach(key => {
      // @ts-ignore
      if (req[key] === null) {
        // @ts-ignore
        delete req[key];
      }
    })
    this.data = null;
    this.resultsLength = 0;
    this.LengthTotal = 0;
    this.adminService.getLstTeacherwCondition(req, this.pageIndex).subscribe(res => {
      this.isLoading = false;
      this.data = new MatTableDataSource(res.results);
      this.resultsLength = res.results.length;
      this.LengthTotal = res.count;
      this.data.paginator = this.paginator;
      this.data.sort = this.sort;
    }, error => this.isLoading = false)
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex + 1;
    this.isLoading = true;
    this.adminService.getLstStudentwCondition(this.setbodyRequest(), this.pageIndex).subscribe(res => {
        this.isLoading = false;
        this.data = new MatTableDataSource(res.results);
      }, error => this.isLoading = false
    );
  }

  private preData() {
    this.adminService.getAllclassNopaging().subscribe(res => {
      this.lstClass = res.classes
    })
    this.adminService.getAllSubject().subscribe(res => {
      this.lstSubject = res.results
    })

  }
}
