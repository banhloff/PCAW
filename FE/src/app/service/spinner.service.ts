import {Injectable} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';

const DEFAULT_TIMEOUT = 300000;

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private id = 0;

  constructor(private spinner: NgxSpinnerService) {
  }

  show() {
    const closeId = ++this.id;
    this.spinner.show();
    setTimeout(() => {
      if (this.id === closeId) {
        this.spinner.hide();
      }
    }, DEFAULT_TIMEOUT);
  }

  hide() {
    this.spinner.hide();
  }
}
