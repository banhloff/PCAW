import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, private breakpointObserver: BreakpointObserver) {
    this.matIconRegistry.addSvgIcon(
      `ic-plus-circle-custom`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/plus-circle-custom.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `ic-plus-custom`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/plus-custom.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'ic_close',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/ic_close.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'ic_avatar',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/avatar-svgrepo-com.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'ic_dashboard',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/dashboard.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'ic_fileAss',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/fileAss.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'ic_signupAccount',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/signupAccount.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'ic_studentSubmit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/studentSubmit.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'ic_class',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/class.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'ic_importStudent',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/importStudent.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'ic_requestTeacher',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/reqteacher.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'ic_signOut',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/signOut.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'ic_google',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/google.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'ic_imgbook',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/imgbook.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'ic_imgluv',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/imgluv.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'ic_imgwrite',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/imgwrite.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'ic_studentManagement',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/studentManagement.svg')
    );
  }

  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler(event: any) {
  //   localStorage.clear();
  // }
  ngOnInit(): void {
  }
  title = 'capstoneProject';
  opened=false;
}
