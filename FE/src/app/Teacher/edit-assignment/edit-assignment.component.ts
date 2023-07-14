import {Component, OnInit, SecurityContext} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Editor, Toolbar} from "ngx-editor";
import {TeacherService} from "../service/teacher.service";
import {HelperService} from "../../shared/services/helper.service";
import {SpinnerService} from "../../service/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {formatDate} from "@angular/common";
import Swal from "sweetalert2";
import {CommonUtils} from "../../shared/services/common-utils.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.scss']
})
export class EditAssignmentComponent implements OnInit {

  AssignmentForm: FormGroup;
  editor: Editor
  format: string
  form: any
  html: string = ""
  Files: File

  in_class: any;
  range: FormGroup
  classrollback: any;

  formEditor = new FormGroup({
    editorContent: new FormControl(null)
  });
  toolbar: Toolbar = [
    ["bold", "italic"],
    [
      "underline",
      "strike"
    ],
    ["code", "blockquote"],
    ["ordered_list", "bullet_list"],
    [{heading: ["h1", "h2", "h3", "h4", "h5", "h6"]}],
    ["link", "image"],
    ["text_color", "background_color"],
    ["align_left", "align_center", "align_right", "align_justify"]
  ];
  renderedHtmlContent: any

  constructor(public teacher: TeacherService, public helper: HelperService, public helpservice: HelperService, private toastr: ToastrService,
              private spinner: SpinnerService, private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) {
    this.preData();
  }

  get doc(): AbstractControl {
    return this.form.get("editorContent");
  }

  setbodyRequest() {
    return {
      langs: '5',
      due_date: this.range.get('end').value,
      start_date: this.range.get('start').value,
      io_file: this.Files,
      is_open: "false",
      description: this.renderedHtmlContent,
      assignment_code: this.AssignmentForm.get('Assignment_Code').value,
      in_class: this.in_class,
      title: this.AssignmentForm.get('Assignment_Name').value,
    }
  }

  ngOnInit() {
    this.in_class = this.route.snapshot.paramMap.get('classId')
    this.classrollback = localStorage.getItem('classRollback');
    localStorage.removeItem('classRollback');
    this.AssignmentForm = new FormGroup({
      'Assignment_Name': new FormControl(null, Validators.required),
      'title': new FormControl(null),
      'Test_case_IO': new FormControl(null, Validators.required),
      // 'isOpen': new FormControl(false),
      'Assignment_Code': new FormControl(null, Validators.required),
    });
    this.range = new FormGroup({
      start: new FormControl<Date | null>(null, Validators.required),
      end: new FormControl<Date | null>(null, Validators.required),
    });
    this.editor = new Editor();
  }

  public sanitizeHtmlContent(htmlstring: any): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, htmlstring);
  }
  onSubmit() {
    if (this.AssignmentForm.invalid) {
      const value = CommonUtils.findInvalidControls(this.AssignmentForm);
      this.toastr.error('invalid ' + value[0], 'Notification');
      return;
    } else {
      if (this.range.invalid) {
        this.toastr.error('invalid DueDate', 'Notification');
        return;
      }
      this.renderedHtmlContent = this.sanitizeHtmlContent(
        this.formEditor.get("editorContent").value
      );
      const result = this.setbodyRequest();
      let bodyForm = new FormData();
      const dueDate = formatDate(result.due_date, 'yyyy-MM-dd', 'en-US');
      const start = formatDate(result.start_date, 'yyyy-MM-dd', 'en-US');

      bodyForm.append('assignment_code', result.assignment_code)
      bodyForm.append('langs', result.langs)
      bodyForm.append('due_date', dueDate)
      bodyForm.append('start_date', start)
      if(result.io_file){
        bodyForm.append('io_file', result.io_file)
      }
      bodyForm.append('is_open', result.is_open)
      bodyForm.append('description', result.description)
      bodyForm.append('in_class', result.in_class)
      bodyForm.append('title', result.title)
      const id = this.route.snapshot.paramMap.get('id')

      this.teacher.editAssignment(bodyForm, id).subscribe(res => {
        this.helper.APP_SHOW_PROCESSING.next(true);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Update Assignment Successfully',
          showConfirmButton: false,
          timer: 1500
        })
        this.helper.APP_SHOW_PROCESSING.next(false);
        this.router.navigate(['teacher/teacher-class', this.in_class, this.classrollback])
      }, error => {
        this.helper.APP_SHOW_PROCESSING.next(false);
        if(error.status==400){
          Swal.fire({
            position: 'center', icon: 'error', title: 'Assignment Code already exists', showConfirmButton: false, timer: 1500
          })
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
  files:File
  fileChange($event: any) {
    if ($event.target.files.length > 0) {
      if ($event.target.files[0].type === "application/x-zip-compressed") {
        const file = $event.target.files[0];
        this.files = file;
      } else {
        Swal.fire({
          position: 'center', icon: 'error', title: 'File Test Case must be .zip', showConfirmButton: false, timer: 2000
        })
        this.AssignmentForm.get('Test_case_IO').setValue(null);
        return;
      }
    }
  }

  private preData() {
    const id = this.route.snapshot.paramMap.get('id')
    this.teacher.getAssignmentDetail(id).subscribe(res => {
      if (res.assignment) {
        this.AssignmentForm.get('Assignment_Name').setValue(res.assignment.title)
        this.AssignmentForm.get('Assignment_Code').setValue(res.assignment.assignment_code)
        this.AssignmentForm.get('Test_case_IO').setValue(res.assignment.io_file)
        this.range.get('start').setValue(res.assignment.start_date)
        this.range.get('end').setValue(res.assignment.due_date)
        this.renderedHtmlContent = res.assignment.description
      }
    })
  }
}
