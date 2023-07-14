import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {HttpClient} from "@angular/common/http";
import {MatTableDataSource} from "@angular/material/table";
import {TeacherService} from "../service/teacher.service";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {HelperService} from "../../shared/services/helper.service";
import {MatSort} from "@angular/material/sort";
import {CommonUtils} from "../../shared/services/common-utils.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-assginment-details',
  templateUrl: './assginment-details.component.html',
  styleUrls: ['./assginment-details.component.scss']
})
export class AssginmentDetailsComponent implements OnInit{

  displayedColumns: string[] = ['ASSIGNMENT', 'fullName', 'STATUS', 'SUBMITDATE', 'PLARISM', 'SCORE', 'actions'];
  data: any = [];
  // dataSource = new MatTableDataSource<any>(data);
  dataSource :MatTableDataSource<any>;
  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  Assignment: any;
  dueDate: any;
  class: any;
  totalSubmit: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  idCourse: string;
  idClass: string;
  lstsubmition: Student[] = []
  lstuserId: any;

  constructor(public helper: HelperService, private _httpClient: HttpClient, private teacherService: TeacherService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.isLoadingResults = false;
    this.class = 'SE1415';
    this.totalSubmit = '20/30';
    this.Assignment = localStorage.getItem('assignment_code')
    this.dueDate = localStorage.getItem('dueDate')
    this.totalSubmit = localStorage.getItem('sub_count') + '/' + localStorage.getItem('std_count')
    this.class = localStorage.getItem('class')
    this.idCourse = this.route.snapshot.paramMap.get('id');
    this.idClass = this.route.snapshot.paramMap.get('classId');
    localStorage.removeItem('assignment_code')
    localStorage.removeItem('dueDate')
    localStorage.removeItem('std_count')
    localStorage.removeItem('sub_count')
    localStorage.removeItem('class')
    this.teacherService.getAllClassStudentById(this.idClass).subscribe(res => {
      if (res.students != null || res.students != undefined) {
        this.lstsubmition = res.students.map((ress: any) => {
          return <Student>{
            uId: ress.id,
            studentCode: ress.profile.code,
            fullName: CommonUtils.isNullOrEmptyReturn(ress.first_name) + '' + CommonUtils.isNullOrEmptyReturn(ress.last_name),
            statuss: null,
            Plagiarism: null,
            Score: null,
            SubmitDate: null,
            content: null,
            idSubmitioin:null
          }
        })
      }
      this.teacherService.getStudentSubmitAss(this.idCourse).subscribe(lstsub => {
        if (lstsub.submissions.length > 0) {
          this.lstuserId = lstsub.submissions.map((uid: any) => {
            return <Student>{
              uId: uid.user.id,
              studentCode: uid.user.profile.code,
              fullName: CommonUtils.isNullOrEmptyReturn(uid.user.first_name) + '' + CommonUtils.isNullOrEmptyReturn(uid.user.last_name),
              statuss: 1,
              Plagiarism: uid.highest_ratio,
              Score: uid.score,
              SubmitDate: uid.date,
              content: uid.content,
              idSubmitioin:uid.id
            }
          })
          this.lstuserId.forEach((lstId: any, index: any) => {
            var foundIndex = this.lstsubmition.findIndex(x => x.uId == lstId.uId)
            if (foundIndex != -1) {
              this.lstsubmition[foundIndex] = this.lstuserId[index]
            }
          })
        }
      })
      this.dataSource = new MatTableDataSource(this.lstsubmition);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }


  view(row: any) {
    this.router.navigate(['teacher/view-plagiarism-student', row.idSubmitioin])
  }

  delete(row: any) {
    Swal.fire({
      title: 'Do you want to delete?',
      text: "Assignment " + row.fullName,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#45cee0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.helper.APP_SHOW_PROCESSING.next(true)
        this.teacherService.deleteSubmitionUser(row.uId).subscribe(res => {
            this.helper.APP_SHOW_PROCESSING.next(false)
            Swal.fire(
              'Deleted!',
              'Submition has been deleted.',
              'success'
            )
            this.ngOnInit()
          }, error =>
            this.helper.APP_SHOW_PROCESSING.next(false)
        )
      }
    })
  }
}

export interface Student {
  uId: any,
  studentCode: any,
  fullName: any,
  statuss: any,
  Plagiarism: any,
  Score: any,
  SubmitDate: any,
  content: any,
  idSubmitioin:any,
}

