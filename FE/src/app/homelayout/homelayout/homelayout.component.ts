import {Component, OnInit} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {GoogleApiService, UserInfo} from "../../service/google-api.service";
import {Router} from "@angular/router";
import {LocalService} from "../../service/local.service";
import {LoginSocialService} from "../../service/login-social.service";
import {CommonUtils} from "../../shared/services/common-utils.service";

@Component({
  selector: 'app-homelayout', templateUrl: './homelayout.component.html', styleUrls: ['./homelayout.component.scss']
})
export class HomelayoutComponent implements OnInit {
  private userInfo: UserInfo;

  sideBarStudent = [{
    linkRouter: '/student/home',  svg:'ic_dashboard', routeName: 'Home'
  }
  ,  {
    linkRouter: '/log-out', svg: 'ic_signOut', routeName: 'Log out'
  }]

  sideBar: any;
  sideBarTeacher = [{
    linkRouter: '/teacher/home', svg: 'ic_dashboard', routeName: 'Home'
  }, {
    linkRouter: '/teacher/student-management', svg: 'ic_studentManagement', routeName: 'Student Management'
  }, {
    linkRouter: '/teacher/class', svg: 'ic_class', routeName: 'Class'
  }, {
    linkRouter: '/teacher/import-class', svg: 'ic_importStudent', routeName: 'Import Class'
  }, {
    linkRouter: '/log-out', svg: 'ic_signOut', routeName: 'Log out'
  }]
  isRole: boolean = false;
  sideBarAdmin = [{
    linkRouter: '/admin/dashboard', icon: '', svg: 'ic_dashboard', routeName: 'Dashboard'
  }, {
    linkRouter: '/admin/student-management', svg: 'ic_studentManagement', routeName: 'Student Management'
  },
    {
      linkRouter: '/admin/teacher-management', svg: 'ic_class', routeName: 'Teacher Management'
    },
    {
      linkRouter: '/admin/class-list', svg: 'ic_class', routeName: 'Class'
    }, {
      linkRouter: '/admin/import-class', svg: 'ic_importStudent', routeName: 'Import Class'
    },
    {
      linkRouter: '/admin/request-account-teacher', svg: 'ic_requestTeacher', routeName: 'Request Account'
    },
    {
      linkRouter: '/log-out', svg: 'ic_signOut', routeName: 'Log out'
    }
  ]


  // isHandset$: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
  opened = false;

  constructor(private readonly googleAuthService: GoogleApiService, private test: LoginSocialService, private localService: LocalService, private breakpointObserver: BreakpointObserver, private router: Router) {
    googleAuthService.userProfileSubject.subscribe(info => {
      this.userInfo = info
    })
    // if (!googleAuthService.isLoggedIn()) {
    //   this.router.navigate(['/login']);
    // }
  }

  userName: String

  ngOnInit() {
    if (localStorage.getItem('yser')) {
      const user = JSON.parse(localStorage.getItem('yser'))
      this.userName = CommonUtils.isNullOrEmptyReturn(user.first_name) + " " + CommonUtils.isNullOrEmptyReturn(user.last_name);
    }
    const teacher = 'GROUP_Teacher';
    const student = 'GROUP_Student';
    const admin = 'isAdmin'
    // this.sideBar = this.sideBarTeacher
    this.isRole = false;
    const role = localStorage.getItem('role');
    switch (role) {
      case teacher:
        this.sideBar = this.sideBarTeacher
        this.isRole = true;
        this.router.navigate(['teacher/home']);
        break;
      case student:
        this.sideBar = this.sideBarStudent;
        this.isRole = true;
        this.router.navigate(['student/home']);
        break;
      case admin:
        this.sideBar = this.sideBarAdmin;
        this.isRole = true;
        // this.router.navigate(['admin/dashboard']);
        break;
      default:
        this.isRole = true;
    }
  }
}
