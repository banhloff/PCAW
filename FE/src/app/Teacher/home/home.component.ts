import {Component, OnInit} from '@angular/core';
import {TeacherService} from "../service/teacher.service";
import {FormBuilder, FormGroup, Validators,} from "@angular/forms";
import {SpinnerService} from "../../service/spinner.service";
import {HelperService} from "../../shared/services/helper.service";

@Component({
  selector: 'app-home-teacher',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchForm: FormGroup;
  data: any;
  constructor(public teacher: TeacherService, public helper: HelperService,
              private form: FormBuilder, private spinner: SpinnerService) {
  }
  ngOnInit() {
    this.spinner.show()
    this.searchForm = this.form.group({
      provinceIdManage: [null, [Validators.maxLength(11)]],
    });
    this.teacher.getAllclass().subscribe(res => {
      this.spinner.show()
      let lstdata = res.results
      lstdata.map((value: any, index: any) => {
        const today = new Date()
        if (value.semester.date_end > today) {
          lstdata[index].process = 'Finished'
        } else {
          lstdata[index].process = 'Processing'
        }
      })
      this.data = lstdata
      this.spinner.hide()
    }, error => {
      this.spinner.hide()
    })
  }

}
