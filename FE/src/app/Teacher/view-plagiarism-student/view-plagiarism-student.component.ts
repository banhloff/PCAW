import {Component, OnInit} from '@angular/core';
import {NuMonacoEditorDiffModel} from "@ng-util/monaco-editor";
import {ActivatedRoute, Router} from "@angular/router";
import {HelperService} from "../../shared/services/helper.service";
import {HttpClient} from "@angular/common/http";
import {TeacherService} from "../service/teacher.service";
import {CommonUtils} from "../../shared/services/common-utils.service";

@Component({
  selector: 'app-view-plagiarism-student',
  templateUrl: './view-plagiarism-student.component.html',
  styleUrls: ['./view-plagiarism-student.component.scss']
})
export class ViewPlagiarismStudentComponent implements OnInit {
  studentAssignmentCompare1: any = '';
  studentAssignmentCompare2: any = '';
  studentCode: any;
  studentName: any;
  studentCodeCompare: any;
  studentNameCompare: any;
  id: any;
  editorOptions = {theme: 'vs-dark', language: 'Javascript'};

  constructor(private rout: Router, private router: ActivatedRoute, public helper: HelperService, private _httpClient: HttpClient, private teacherService: TeacherService) {
  }

  ngOnInit(): void {
    this.id = this.router.snapshot.paramMap.get('id');
    this.teacherService.getSubmitionbyId(this.id).subscribe(value => {
      this.old = Object.assign({}, this.old, {
        code: value.submission.content
      });
      this.studentName = CommonUtils.isNullOrEmptyReturn(value.submission.user.first_name) + ' ' + CommonUtils.isNullOrEmptyReturn(value.submission.user.last_name)
      this.studentCode = value.submission.user.profile.code
    })
    this.teacherService.checkPlarism(this.id).subscribe(res => {
      const idPlarism = res.similarity[0].id;
      this.teacherService.getSubmitionbyId(idPlarism).subscribe(value => {
        this.new = Object.assign({}, this.new, {
          code: value.submission.content
        });
        this.studentNameCompare = CommonUtils.isNullOrEmptyReturn(value.submission.user.first_name) + ' ' + CommonUtils.isNullOrEmptyReturn(value.submission.user.last_name)
        this.studentCodeCompare = value.submission.user.profile.code
      })
    })
  }
  old: NuMonacoEditorDiffModel = {code: `<p>1</p>`, language: 'Javascript'};
  new: NuMonacoEditorDiffModel = {code: `<p>2</p>`, language: 'python'};
}
