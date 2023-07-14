import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "../Teacher/home/home.component";

import {NgModule} from "@angular/core";
import {HomeAdminComponent} from "./admin/home-admin/home-admin.component";
import {RequestAccountTeacherComponent} from "./admin/request-account-teacher/request-account-teacher.component";
import {DashboardComponent} from "./admin/dashboard/dashboard.component";
import {ClassesComponent} from "./admin/classes/classes.component";
import {StudentManagementComponent} from "./admin/student-management/student-management.component";
import {ImportClassComponent} from "../Teacher/import-class/import-class.component";
import {TeacherManagementComponent} from "./admin/teacher-management/teacher-management.component";
import {DialogClassesComponent} from "./admin/classes/dialog-classes/dialog-classes.component";

const routes: Routes = [
  {
    path: 'home',
    component: HomeAdminComponent
  },
  {
    path: 'class-list',
    component: ClassesComponent
  },
  {
    path: 'class-list/:id',
    component: DialogClassesComponent
  },
  {
    path: 'student-management',
    component: StudentManagementComponent
  },
  {
    path: 'teacher-management',
    component: TeacherManagementComponent
  },
  {
    path: 'request-account-teacher',
    component: RequestAccountTeacherComponent
  },
  {
    path: 'import-class',
    component: ImportClassComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
