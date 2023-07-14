import {Component, OnInit, SecurityContext} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Editor, Toolbar} from "ngx-editor";

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss']
})
export class HomeAdminComponent implements OnInit {
  constructor(private sanitizer: DomSanitizer) {}
  htmlContent =
    "<p>This editor has been wired up to render code blocks as instances of the <a href='https://codemirror.net' title='https://codemirror.net' target='_blank'>Simple HYPERLINK</a> code editor, which provides <a title='' target='_blank' href='http://testing.com/book.html?default=<script>alert(document.cookie)</script>'>XSS EXAMPLE </a></p>";
  renderedHtmlContent: SafeHtml = "";
  html:string="";
  editor: Editor;
  toolbar: Toolbar = [
    ["bold", "italic"],
    [
      "underline"
      //"strike"
    ],
    //["code", "blockquote"],
    ["ordered_list", "bullet_list"]
    //[{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    //["link", "image"],
    //["text_color", "background_color"],
    //["align_left", "align_center", "align_right", "align_justify"]
  ];

  form = new FormGroup({
    'editorContent': new FormControl(null)
  });

  get doc(): AbstractControl {
    return this.form.get("editorContent");
  }

  // voir la doc : https://sibiraj-s.github.io/ngx-editor/#/configuration
  ngOnInit(): void {
    this.editor = new Editor();
  }

  onSubmit() {
    //console.log("Your form data : ", this.form.value);
    console.log("KO SANITIZATION : ", this.form.get("editorContent").value);
    console.log(
      "OK SANITIZATION : ",
      this.sanitizeHtmlContent(this.form.get("editorContent").value)
    );
    this.renderedHtmlContent = this.sanitizeHtmlContent(
      this.form.get("editorContent").value
    );
  }

  public sanitizeHtmlContent(htmlstring:any): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, htmlstring);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

}
