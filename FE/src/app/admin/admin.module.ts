import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import {AdminRoutingModule} from "./admin.routing";
import {ReactiveFormsModule} from "@angular/forms";
import { ClassImportComponent } from './admin/class-import/class-import.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { RequestAccountTeacherComponent } from './admin/request-account-teacher/request-account-teacher.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {NgApexchartsModule} from "ng-apexcharts";
import { ClassesComponent } from './admin/classes/classes.component';
import { StudentManagementComponent } from './admin/student-management/student-management.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { TeacherManagementComponent } from './admin/teacher-management/teacher-management.component';
import { DialogEditStudentComponent } from './admin/student-management/dialog-edit-student/dialog-edit-student.component';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import { DialogEditTeacherComponent } from './admin/teacher-management/dialog-edit-teacher/dialog-edit-teacher.component';
import {NgxEditorModule} from "ngx-editor";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { DialogClassesComponent } from './admin/classes/dialog-classes/dialog-classes.component';
import {MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
  declarations: [
    HomeAdminComponent,
    ClassImportComponent,
    DashboardComponent,
    RequestAccountTeacherComponent,
    ClassesComponent,
    StudentManagementComponent,
    TeacherManagementComponent,
    DialogEditStudentComponent,
    DialogEditTeacherComponent,
    DialogClassesComponent
  ],
  imports: [
    CommonModule, AdminRoutingModule, MatNativeDateModule, ReactiveFormsModule, NgxEditorModule, MatIconModule, MatButtonModule, NgApexchartsModule, MatPaginatorModule, MatTableModule, NgSelectModule, MatProgressSpinnerModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatCheckboxModule
  ]
})
export class AdminModule { }
