import {HttpClient} from '@angular/common/http';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from "@angular/material/table";
import {TeacherService} from "../service/teacher.service";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {HelperService} from "../../shared/services/helper.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-teacher-class',
  templateUrl: './teacher-class.component.html',
  styleUrls: ['./teacher-class.component.css']
})
export class TeacherClassComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['ASSIGNMENT', 'TOTALSUBMIT', 'STARTDATE', 'ENDDATE', 'actions'];
  data: any = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  id: any;
  className: any;
  langs:any;

  constructor(public helper: HelperService, private _httpClient: HttpClient, private router: ActivatedRoute, private route: Router, private teacherService: TeacherService) {
  }

  ngOnInit(): void {
    this.id = this.router.snapshot.paramMap.get('id');
    this.className = this.router.snapshot.paramMap.get('class');
    this.fetchData();
  }

  fetchData() {
    this.teacherService.getClassDetails(this.id).subscribe(res => {
      this.data = res.assignments
      this.langs = res.assignments[0].assignment.in_class.langs
      this.data = new MatTableDataSource<any>(this.data);
    });
    this.resultsLength = this.data.length;
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    // this.isRateLimitReached = false;
    // this.isLoadingResults = false;
  }

  addAssignment() {
    localStorage.setItem('classRollback', this.className)
    localStorage.setItem('langs', this.langs)
    this.route.navigate(['teacher/add-assignment', this.id])
  }

  view(row: any) {
    localStorage.setItem('assignment_code', row.assignment.assignment_code)
    localStorage.setItem('dueDate', row.assignment.due_date)
    localStorage.setItem('std_count', row.assignment.std_count)
    localStorage.setItem('sub_count', row.assignment.sub_count)
    localStorage.setItem('class', row.assignment.in_class.code)
    this.route.navigate(['teacher/assignment-details/', row.assignment.id, this.id])
  }

  edit(row: any) {
    localStorage.setItem('classRollback', this.className)
    this.route.navigate(['teacher/edit-assignment/' + row.assignment.id + '/edit/' + this.id])
  }

  delete(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete Assignment " + row.assignment.assignment_code + "?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#45cee0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.helper.APP_SHOW_PROCESSING.next(true);
        this.teacherService.deleteAssignment(row.assignment.id).subscribe(res => {
          Swal.fire(
            'Deleted!',
            'Assignment has been deleted.',
            'success'
          )
          this.fetchData()
          this.helper.APP_SHOW_PROCESSING.next(false);
        })
      }
    })
  }
}
