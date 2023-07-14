import {Component, OnInit} from "@angular/core";
import {MatDialog,} from "@angular/material/dialog";
import {DialogAddClassComponent} from "../dialog-add-class/dialog-add-class.component";
import {StudentApiService} from "../student-api.service";
import {Spinner} from "ngx-spinner";
import {SpinnerService} from "../../service/spinner.service";
import {HelperService} from "../../shared/services/helper.service";
import {DialogService} from "../../service/dialog.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  data: any;
  result: any;

  lstClass: any;

  constructor(private spinner: SpinnerService, public dialog: MatDialog, public helper: HelperService, private dialogservice: DialogService, private studentService: StudentApiService) {
  }

  ngOnInit() {
    this.fetchData();
    this.dialogservice.getAllClassNoPagging().subscribe(res => {
      this.lstClass = res.classes;
    })
  }

  fetchData() {
    this.studentService.getAllclass().subscribe(data => {
      this.spinner.show()
      let lstdata = data.classes
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
    }, error => this.spinner.hide())
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddClassComponent, {
      height: '400px',
      width: '600px',
      data: {
        lstClass: this.lstClass
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchData()
      }
    });
  }
}
