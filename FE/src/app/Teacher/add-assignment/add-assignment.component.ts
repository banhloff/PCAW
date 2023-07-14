import {Component, OnDestroy, OnInit, SecurityContext, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Editor, Toolbar} from "ngx-editor";
import {TeacherService} from "../service/teacher.service";
import {HelperService} from "../../shared/services/helper.service";
import {SpinnerService} from "../../service/spinner.service";
import {ActivatedRoute, Route, Router} from "@angular/router";
import Swal from "sweetalert2";
import {formatDate} from "@angular/common";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";
import {CommonUtils} from "../../shared/services/common-utils.service";

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.scss']
})
export class AddAssignmentComponent implements OnInit, OnDestroy {
  addAssignmentForm: FormGroup;
  editor: Editor
  format: string
  form: any
  html: string = ""
  files: File

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
  }

  get doc(): AbstractControl {
    return this.form.get("editorContent");
  }

  setbodyRequest() {
    return {
      langs: '5',
      due_date: this.range.get('end').value,
      start_date: this.range.get('start').value,
      io_file: this.files,
      is_open: "false",
      description: this.renderedHtmlContent,
      assignment_code: this.addAssignmentForm.get('Assignment_Code').value,
      in_class: this.in_class,
      title: this.addAssignmentForm.get('Assignment_Name').value,
    }
  }

  ngOnInit() {
    this.in_class = this.route.snapshot.paramMap.get('id')
    this.classrollback = localStorage.getItem('classRollback');
    localStorage.removeItem('classRollback');
    this.addAssignmentForm = new FormGroup({
      'Assignment_Name': new FormControl(null, Validators.required),
      'title': new FormControl(null),
      'Test_case_IO': new FormControl(null, Validators.required),
      // 'isOpen': new FormControl(false),
      'Assignment_Code': new FormControl(null, Validators.required),
    });
    this.range = new FormGroup({
      start: new FormControl<Date | null>(null,Validators.required),
      end: new FormControl<Date | null>(null,Validators.required),
    });
    this.editor = new Editor();
    // this.addAssignmentForm.setValue({
    //   'userData':{
    //     'username':'geetha',
    //     'email':'geetha@gmail.com'
    //   },
    //   'gender':'female',
    //   'hobbies':[]
    // })
  }

  public sanitizeHtmlContent(htmlstring: any): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, htmlstring);
  }

  onSubmit() {
    if (this.addAssignmentForm.invalid) {
      const value = CommonUtils.findInvalidControls(this.addAssignmentForm);
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
      bodyForm.append('io_file', result.io_file)
      bodyForm.append('is_open', result.is_open)
      bodyForm.append('description', result.description)
      bodyForm.append('in_class', result.in_class)
      bodyForm.append('title', result.title)
      this.teacher.addAssignment(bodyForm).subscribe(res => {
        this.helper.APP_SHOW_PROCESSING.next(true);
        if (res.message == 'Create Succeeded!') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Create Assignment Sucessfully',
            showConfirmButton: false,
            timer: 1500
          })
        }
        this.helper.APP_SHOW_PROCESSING.next(false);
        this.router.navigate(['teacher/teacher-class', this.in_class, this.classrollback])
      }, error => {
        this.helper.APP_SHOW_PROCESSING.next(false);
        Swal.fire({
          position: 'center', icon: 'error', title: 'Assignment Code already exists', showConfirmButton: false, timer: 1500
        })
      })
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  fileChange($event: any) {
    if ($event.target.files.length > 0) {
      if ($event.target.files[0].type === "application/x-zip-compressed") {
        const file = $event.target.files[0];
        this.files = file;
      } else {
        Swal.fire({
          position: 'center', icon: 'error', title: 'File Test Case must be .zip', showConfirmButton: false, timer: 2000
        })
        this.addAssignmentForm.get('Test_case_IO').setValue(null);
        return;
      }
    }
  }
}
