import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {AuthGuard} from "../core/guards/guards.guard";
import {Roles} from "../core/guards/user-roles";

const routes: Routes = [
  {
    path:'student',loadChildren:()=>import('../Student/student.module').then(m=>m.StudentModuleModule),canActivate:[AuthGuard],data:{
      userRoles:[Roles.STUDENT]
    }
  },
  {
    path:'teacher',loadChildren:()=>import('../Teacher/teacher.module').then(m=>m.TeacherModuleModule)
  },
  {
    path:'admin',loadChildren:()=>import('../admin/admin.module').then(m=>m.AdminModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
