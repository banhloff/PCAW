import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './shared/pageNotFound/pageNotFound.component';
import {HomelayoutComponent} from './homelayout/homelayout/homelayout.component';
import {SignoutComponent} from "./login/loginComponent/logout.component";
import {AuthGuards} from "./core/guards/auth.guards";
import {AuthGuard} from "./core/guards/guards.guard";
import {RegisterAccountComponent} from "./register-account/register-account.component";

const routes: Routes = [{
  path: '',
  component: HomelayoutComponent,
  loadChildren: () => import('./homelayout/Layout.module').then(m => m.LayoutModuleModule)
  , canActivate: [AuthGuard]
}, // ,canActivate:[AuthGuard]
  {
    path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
    data: {
      title: 'Practice Coding Assignment Website',
      metatags: {
        description: 'Practice Coding Assignment Website',
        keywords: 'Practice,Coding',
      }
    }
  },
  {
    path: 'register', component: RegisterAccountComponent
  },
  {
    path: 'log-out', component: SignoutComponent
  },
  {
    path: 'Oauth', component: AuthGuards,
  },
  {
    path: '**', pathMatch: 'full', component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
