import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {StudentRoutingModule} from './student.routing';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {HomeComponent} from './home/home.component';
import {DialogAddClassComponent} from './dialog-add-class/dialog-add-class.component';
import {ClassDetailsComponent} from './classDetails/classDetails.component';
import {SharedModule} from "../shared/shared.module";
import {MatButtonModule} from "@angular/material/button";
import {AssignmentComponent} from './assignment/assignment.component';
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
  declarations: [
    HomeComponent,
    DialogAddClassComponent,
    ClassDetailsComponent,
    AssignmentComponent
  ],
  imports: [
    CommonModule, MatPaginatorModule, MatTableModule, MatIconModule, MatInputModule,
    MatIconModule, StudentRoutingModule, MatToolbarModule, MatFormFieldModule, MatProgressSpinnerModule, SharedModule, MatButtonModule, FormsModule, ReactiveFormsModule, NgSelectModule
  ]
})
export class StudentModuleModule { }
