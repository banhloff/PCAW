import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {HelperService} from "../../../shared/services/helper.service";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../service/admin.service";
import {DialogEditStudentComponent} from "../student-management/dialog-edit-student/dialog-edit-student.component";
import Swal from "sweetalert2";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-request-account-teacher',
  templateUrl: './request-account-teacher.component.html',
  styleUrls: ['./request-account-teacher.component.scss']
})
export class RequestAccountTeacherComponent implements OnInit {
  displayedColumns: string[] = ['STUDENTCODE', 'NAME', 'EMAIL', 'DATEJOINT', 'ROLE', 'ACTION'];
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
  range: FormGroup


  constructor(public helper: HelperService, private form: FormBuilder,
              private _httpClient: HttpClient, public dialog: MatDialog, private router: ActivatedRoute, private route: Router, private adminService: AdminService) {
  }

  ngOnInit(): void {
    this.submitForm = this.form.group({
      studentCode: [null],
    });
    this.range = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
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
    Swal.fire({
      title: 'Do you want to Accept?',
      text: " Account " + row.profile.code + " As teacher?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#45cee0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.adminService.grantAccessTeacher(row.id).subscribe(res => {
          this.isLoading = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Request Account Successfully',
            showConfirmButton: false,
            timer: 2000
          })
          this.fetchData();
        }, error => this.isLoading = false)
      }
    })
  }

  delete(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to Reject " + row.profile.code + "?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#45cee0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.adminService.grantAccessStudent(row.id).subscribe(res => {
          this.isLoading = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Request Account Successfully',
            showConfirmButton: false,
            timer: 2000
          })
          this.fetchData();
        }, error => this.isLoading = false)
      }
    })
  }

  fetchData() {
    this.adminService.getLstAllaccount(this.pageIndex).subscribe(res => {
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
      code: this.submitForm.get('studentCode').value == '' ? null : this.submitForm.get('studentCode').value,
      start: formatDate(this.range.get('start').value, 'yyyy-MM-dd', 'en-US') == '1970-01-01' ? null : formatDate(this.range.get('start').value, 'yyyy-MM-dd', 'en-US'),
      end: formatDate(this.range.get('end').value, 'yyyy-MM-dd', 'en-US') == '1970-01-01' ? null : formatDate(this.range.get('end').value, 'yyyy-MM-dd', 'en-US')
    }
  }

  search() {
    if (this.pageIndex > 1) {
      this.pageIndex = 1
    }
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

    this.adminService.getLstAllAccountWcondition(req, this.pageIndex).subscribe(res => {
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
    this.adminService.getLstAllAccountWcondition(this.setbodyRequest(), this.pageIndex).subscribe(res => {
        this.isLoading = false;
        this.data = new MatTableDataSource(res.results);
      }, error => this.isLoading = false
    );
  }


}
