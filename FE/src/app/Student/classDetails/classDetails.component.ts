import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {StudentApiService} from "../student-api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HelperService} from "../../shared/services/helper.service";

@Component({
  selector: 'app-classDetails',
  templateUrl: './classDetails.component.html',
  styleUrls: ['./classDetails.component.css']
})
export class ClassDetailsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['assignment_code', 'due_date', 'STATUS', 'SUBMITDATE', 'actions'];
  data: any = [];
  dataSource :MatTableDataSource<any>;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  Assignment: any;
  dueDate: any;
  class: any;
  totalSubmit: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  id: any;

  constructor(private rout: Router, private router: ActivatedRoute,public helper :HelperService, private _httpClient: HttpClient, private studentApiService: StudentApiService) {
  }
  ngOnInit(): void {
    this.id = this.router.snapshot.paramMap.get('id');
    this.studentApiService.getClassDetails(this.id).subscribe(res => {
      this.isLoadingResults = true;
      this.data = res.assignments
      this.isLoadingResults = false;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit(): void {
  }

  viewAssignment(id: any, langs: any) {
    this.rout.navigate(['student/assignment/', id]);
    localStorage.setItem('langs', JSON.stringify(langs))
  }
}
