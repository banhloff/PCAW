import {Injectable} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root',
})
export class CommonUtils {
  public static isNullOrEmpty(str: any): boolean {
    return !str || (str + '').trim() === '';
  }

  public static isNullOrEmptyReturn(str: any): String {
    if (!this.isNullOrEmpty(str))
      return str;
    return '';
  }

  public static findInvalidControls(Form: FormGroup) {
    const invalid = [];
    const controls = Form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name.replace('_',' '));
      }
    }
    return invalid;
  }

  public static buildParams(obj: any): HttpParams {
    return Object.entries(obj || {}).reduce((params, [key, value]) => {
      if (value === null) {
        return params.set(key, String(''));
      } else if (typeof value === typeof {}) {
        return params.set(key, JSON.stringify(value));
      } else {
        return params.set(key, String(value));
      }
    }, new HttpParams());
  }


  static checkLangs(langs: any) {
    if (langs.length > 0) {
      for (let a of langs) {
        if (a.name.includes('python2') || a.name.includes('python3')) {
          return '.py'
        } else if (a.name.includes('java')) {
          return '.java'
        } else if (a.name.includes('csharp')) {
          return '.cs'
        }else if (a.name.includes('c')||a.name.includes('cpp')){
          return '.cpp'
        }
      }
    }
    return null;
  }
}
