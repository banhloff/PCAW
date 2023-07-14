import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {HelperService} from "../../../shared/services/helper.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import Swal from "sweetalert2";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdminService} from "../service/admin.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
  displayedColumns: string[] = ['CLASSCODE', 'CLASSNAME', 'INSTRUCTOR', 'SUBJECT', 'STUDENT', 'ACTION'];
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
  lstSemester: any;


  constructor(public helper: HelperService, private form: FormBuilder,private dialog:MatDialog,
              private _httpClient: HttpClient, private router: ActivatedRoute, private route: Router, private adminService: AdminService) {
    this.preData();
  }

  ngOnInit(): void {
    this.submitForm = this.form.group({
      subject: [null],
      class: [null],
      semester: [null],
    });
    this.fetchData();
  }

  pageEvent: any;

  edit(row: any) {
   this.route.navigate(['admin/class-list/',row.id])
  }

  delete(row: any) {
    var content = document.createElement('div');
    content.innerHTML = '<h1><strong>' + row.name + '</strong></h1>';
    Swal.fire({
      title: 'Do you want to delete Class ?',
      html: content,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#45cee0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading=true;
        this.adminService.deleteClass(row.id).subscribe(res => {
          this.isLoading = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Delete Class Successfully',
            showConfirmButton: false,
            timer: 2000
          })
          this.fetchDatawCondition();
        })
      }
    })
  }

  private preData() {
    this.adminService.getAllclassNopaging().subscribe(res => {
      this.lstClass = res.classes
    })
    this.adminService.getAllSemester().subscribe(res => {
      this.lstSemester = res.results
    })
    this.adminService.getAllSubject().subscribe(res => {
      this.lstSubject = res.results
    })

  }

  length: any;
  pageSize: any;
  pageIndex: any = 1;

  fetchData() {
    this.adminService.getAllclass().subscribe(res => {
        this.isLoading = false;
        this.data = new MatTableDataSource(res.results);
        this.resultsLength = res.results.length;
        this.LengthTotal = res.count;
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;
      }, error => this.isLoading = false
    );
  }
  fetchDatawCondition() {
    this.adminService.getAllclassbyCondition(this.setbodyRequest(),this.pageIndex).subscribe(res => {
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
      subject: this.submitForm.get('subject').value,
      code: this.submitForm.get('class').value,
      semester: this.submitForm.get('semester').value,
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
    this.isLoading = true;
    this.adminService.getAllclassbyCondition(req,this.pageIndex).subscribe(res => {
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
    this.pageIndex = e.pageIndex+1;
    this.isLoading = true;
    this.adminService.getAllclassbyCondition(this.setbodyRequest(),this.pageIndex).subscribe(res => {
      this.isLoading = false;
      this.data = new MatTableDataSource(res.results);
    }, error => this.isLoading = false)
  }
}

