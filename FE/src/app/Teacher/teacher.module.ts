import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';
import {MatIconModule} from '@angular/material/icon';
import {TeacherRoutingModule} from './teacher.routing';
import {ImportClassComponent} from './import-class/import-class.component';
import {TeacherClassComponent} from './teacher-class/teacher-class.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {SharedModule} from "../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AddAssignmentComponent} from './add-assignment/add-assignment.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from '@angular/material/input';
import {ViewPlagiarismStudentComponent} from './view-plagiarism-student/view-plagiarism-student.component';
import {MatButtonModule} from "@angular/material/button";
import {AssginmentDetailsComponent} from './assginment-details/assginment-details.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgSelectModule} from "@ng-select/ng-select";
import { EditAssignmentComponent } from './edit-assignment/edit-assignment.component';
import {NuMonacoEditorDiffComponent} from "@ng-util/monaco-editor";
import {NgxEditorModule} from "ngx-editor";



@NgModule({
  declarations: [
    HomeComponent,
    ImportClassComponent, TeacherClassComponent, AddAssignmentComponent, ViewPlagiarismStudentComponent, AssginmentDetailsComponent, EditAssignmentComponent
  ],
  imports: [
    CommonModule, MatPaginatorModule, MatTableModule, FormsModule, MatInputModule, ReactiveFormsModule, MatNativeDateModule,NgxEditorModule,
    MatDatepickerModule, MatIconModule, TeacherRoutingModule, MatToolbarModule, MatFormFieldModule, MatProgressSpinnerModule, SharedModule, ReactiveFormsModule, MatButtonModule, MatTooltipModule, NgSelectModule, NuMonacoEditorDiffComponent,
  ]
})

export class TeacherModuleModule { }
