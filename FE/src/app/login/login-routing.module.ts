import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./loginComponent/login.component";
import {PageNotFoundComponent} from "../shared/pageNotFound/pageNotFound.component";

const routes: Routes = [

  {
    path:'',component:LoginComponent
  },

  { path: '**', pathMatch: 'full',
    component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
