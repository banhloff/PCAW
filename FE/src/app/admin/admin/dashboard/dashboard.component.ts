import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import {AdminService} from "../service/admin.service";
import {HelperService} from "../../../shared/services/helper.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnChanges {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  accountSignUp: any = 0;
  assginment: any = 0;
  studentSubmitted: any = 0;
  data = [{
    "order": "current_first",
    "user_data": [
      18,
      0,
      1
    ],
    "submission_data": [
      8,
      0,
      0
    ]
  }]

  constructor(private adminService: AdminService, public helper: HelperService) {
    this.chartOptions = {
      series: [
        {
          name: "Account Sign Up",
          data: [],
          color: "#1091f4"
        },
        {
          name: "Assignment",
          data: [],
          color: "#d9cbf6"
        },
        {
          name: "Student Submitted File",
          data: [],
          color: "#f5b98e"
        }
      ],
      chart: {
        type: "bar",
        height: 400
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "20%",
          // endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
        ]
      },
      yaxis: {
        title: {
          text: ""
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val;
          }
        }
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    const duration = 10;
    this.countstopAccountSignUp(duration, changes['data'].currentValue.accountSignUp);
  }

  ngOnInit(): void {
    const duration = 15;

    this.adminService.getDashboard().subscribe(res => {
      const val = res.submission_data.reduce((re: any, cur: any) => {
        return re + cur;
      })
      const lstsubmit = res.submission_data;
      const lstSignup = res.user_data;
      const lstAssignment = res.assignment_data;
      const signUp = res.user_data.reduce((re: any, cur: any) => {
        return re + cur;
      })
      const assignment = res.assignment_data.reduce((re: any, cur: any) => {
        return re + cur;
      })
      this.chartOptions.series = [{
        data: lstSignup
      }, {data: [lstAssignment]}, {data: lstsubmit}];
      this.countstopAccountSignUp(duration, signUp);
      this.countstopAssigment(duration, assignment);
      this.countstopStudentSubmitted(duration, val);
    })
    this.setCategory();


  }

  countstopAccountSignUp(duration: any, data: any) {
    if (data === 0) {
      return;
    }
    let count = 1;
    let value: any;
    value = setInterval(() => {
      count = data > 30 ? Math.round((data / (duration * 1000)) * 100) : 1;
      this.accountSignUp += count;
      if (this.accountSignUp >= data) {
        this.accountSignUp = data;
        clearInterval(value);
      }
    }, duration);
  }

  countstopAssigment(duration: any, data: any) {
    if (data === 0) {
      return;
    }
    let count = 1;
    let value: any;
    value = setInterval(() => {
      count = data > 30 ? Math.round((data / (duration * 1000)) * 100) : 1;
      this.assginment += count;
      if (this.assginment >= data) {
        this.assginment = data;
        clearInterval(value);
      }
    }, duration);
  }

  countstopStudentSubmitted(duration: any, data: any) {
    if (data === 0) {
      return;
    }
    let count = 1;
    let value: any;
    value = setInterval(() => {
      count = data > 30 ? Math.round((data / (duration * 1000)) * 100) : 1;
      this.studentSubmitted += count;
      if (this.studentSubmitted >= data) {
        this.studentSubmitted = data;
        clearInterval(value);
      }
    }, duration);
  }

  private setCategory() {
    let value = new Date();
    let value1 = new Date();
    value1.setMonth(value.getMonth() - 1);
    let value2 = new Date();
    value2.setMonth(value1.getMonth() - 1);
    const month = value.toLocaleString("default", {month: "long"});
    const month1 = value1.toLocaleString("default", {month: "long"});
    const month2 = value2.toLocaleString("default", {month: "long"});
    this.chartOptions.xaxis.categories = [month2, month1, month]
  }
}
