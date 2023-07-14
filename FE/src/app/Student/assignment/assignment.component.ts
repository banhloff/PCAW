import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {StudentApiService} from "../student-api.service";
import {HelperService} from "../../shared/services/helper.service";
import {CommonUtils} from "../../shared/services/common-utils.service";
import Swal from "sweetalert2";
import {DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss']
})
export class AssignmentComponent implements OnInit {
  isLoading: boolean;
  id: any;
  data: any;
  title: any;
  description: any;

  langs: any;

  files: any;
  fileContent: any;
  lstLang: any[]
  fileName: any;
  assignmentCode: any;
  in_class: any;
  submitDate: any;
  status: any;
  score: any;
  isSubmited = false;
  fileUrl: any

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: any) {
    this.prepareFilesList(files.target.files[0]);
  }

  ngOnInit() {
    this.fetchData()
    const langs = JSON.parse(localStorage.getItem('langs'));
    this.lstLang = langs;
    this.lstLang = this.lstLang.map(res => {
      return res.name
    })
    localStorage.removeItem('langs')
    this.langs = CommonUtils.checkLangs(langs);
  }

  contentData: any;
  fileType: any

  prepareFilesList(files: any) {
    if (!files.name.includes(this.langs)) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'File content is invalid for this submittion',
        validationMessage: this.langs,
        showConfirmButton: false,
        timer: 2000
      })
      return;
    }
    this.fileName = files.name
    this.files = files;
    this.readFile(this.files)
  }

  readFile(file: File) {
    var reader = new FileReader();
    reader.onload = () => {
      this.fileContent = reader.result;
    };
    reader.readAsText(file);
  }

  setBodyRequest() {
    return {
      lang: this.lstLang[0],
      content: this.fileContent,
      assignment: this.assignmentCode,
      file_name: this.fileName,
      in_class: this.in_class
    }
  }

  constructor(public helper: HelperService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private studentApiService: StudentApiService) {
  }
dueDate:any;
  fetchData() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.studentApiService.getAssignmentDetails(this.id).subscribe(res => {
      this.title = res.assignment.title;
      this.description = res.assignment.description;
      this.assignmentCode = res.assignment.assignment_code;
      this.in_class = res.assignment.in_class.code;
      this.dueDate = res.assignment.due_date
      if (res.submissions[0] != undefined) {
        this.isSubmited= true;
        this.submitDate = res.submissions[0].date;
        this.status = res.submissions[0].status;
        this.score = res.submissions[0].score;
        this.contentData = res.submissions[0].content;
      }
    })
  }

  onsubmit() {
    const result = this.setBodyRequest();
    if (result.file_name == null || result.file_name == undefined) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please Recheck submition',
        validationMessage: this.langs,
        showConfirmButton: false,
        timer: 2000
      })
      return
    }
    this.isLoading = true;
    this.studentApiService.submitSubmition(this.setBodyRequest()).subscribe(res => {
      if (res.message == 'Submit Succeeded!') {
        this.fetchData();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Submit successfully',
          showConfirmButton: false,
          timer: 2000
        })
      }
      this.isLoading = false;

    }, error => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Submit Error',
        showConfirmButton: false,
        timer: 2000
      });
      this.isLoading = false;
    })
  }

  downloadFile() {
    this.fileType = "submit" + this.langs;
    const data = this.contentData;
    const blob = new Blob([data], {type: 'application/octet-stream'});
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }
}
