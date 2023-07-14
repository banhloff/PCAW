import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "../Student/home/home.component";
import {ClassDetailsComponent} from "./classDetails/classDetails.component";
import {AssignmentComponent} from "./assignment/assignment.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "class/:id",
    component: ClassDetailsComponent,
  },
  {
    path: "assignment/:id",
    component: AssignmentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
