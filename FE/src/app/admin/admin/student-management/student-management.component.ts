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
import {DialogAddClassComponent} from "../../../Student/dialog-add-class/dialog-add-class.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogEditStudentComponent} from "./dialog-edit-student/dialog-edit-student.component";

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.scss']
})
export class StudentManagementComponent implements OnInit {
  displayedColumns: string[] = ['STUDENTCODE', 'NAME', 'EMAIL', 'SUBJECT', 'CLASS', 'ACTION'];
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
    const dialogRef = this.dialog.open(DialogEditStudentComponent, {
      height: '450px',
      width: '700px',
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
        this.isLoading = true;
        this.adminService.deleteStudentById(row.id).subscribe(res => {
          this.isLoading = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Delete Account Successfully',
            showConfirmButton: false,
            timer: 2000
          })
          this.fetchData();
        }, error => this.isLoading = false)
      }
    })
  }

  fetchData() {
    this.adminService.getLstStudent(this.pageIndex).subscribe(res => {
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
      subjects: this.submitForm.get('subject').value,
      classes: this.submitForm.get('class').value,
      code: this.submitForm.get('studentCode').value == '' ? null : this.submitForm.get('studentCode').value,
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
    this.adminService.getLstStudentwCondition(req, this.pageIndex).subscribe(res => {
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
    this.adminService.getAllclass().subscribe(res => {
      this.lstClass = res.results
    })
    this.adminService.getAllSubject().subscribe(res => {
      this.lstSubject = res.results
    })

  }
}
