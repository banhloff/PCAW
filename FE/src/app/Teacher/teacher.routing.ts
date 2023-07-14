import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "../Teacher/home/home.component";
import {AddAssignmentComponent} from "./add-assignment/add-assignment.component";
import {ViewPlagiarismStudentComponent} from "./view-plagiarism-student/view-plagiarism-student.component";
import {ImportClassComponent} from "./import-class/import-class.component";
import {ClassDetailsComponent} from "../Student/classDetails/classDetails.component";
import {TeacherClassComponent} from "./teacher-class/teacher-class.component";
import {AssginmentDetailsComponent} from "./assginment-details/assginment-details.component";
import {EditAssignmentComponent} from "./edit-assignment/edit-assignment.component";
import {StudentManagementComponent} from "../admin/admin/student-management/student-management.component";
import {ClassesComponent} from "../admin/admin/classes/classes.component";

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  } ,
  {
    path: 'add-assignment/:id',
    component: AddAssignmentComponent
  } ,
  {
    path: 'edit-assignment/:id/edit/:classId',
    component: EditAssignmentComponent
  } ,
  {
    path: 'view-plagiarism-student/:id',
    component: ViewPlagiarismStudentComponent
  },
  {
    path: 'import-class',
    component: ImportClassComponent
  },
  {
    path: 'student-management',
    component: StudentManagementComponent
  },
  {
    path: 'class',
    component: ClassesComponent,
  },
  {
    path: 'view-assignment',
    component: ClassDetailsComponent
  },
  {
    path: 'teacher-class/:id/:class',
    component: TeacherClassComponent
  },
  {
    path: 'assignment-details/:id/:classId',
    component: AssginmentDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
