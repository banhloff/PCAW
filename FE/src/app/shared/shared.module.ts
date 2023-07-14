import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {SelectSearchBoxComponent} from "./component/select-search-box/select-search-box.component";
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DCardComponent} from './component/d-card/d-card.component';
import {RouterLink} from "@angular/router";

@NgModule({
  declarations: [
    SelectSearchBoxComponent,
    DCardComponent
  ],
  exports: [
    SelectSearchBoxComponent,
    DCardComponent
  ],
  imports: [
    CommonModule, MatPaginatorModule, MatTableModule, NgSelectModule,
    MatIconModule, MatToolbarModule, MatFormFieldModule, MatProgressSpinnerModule, FormsModule, ReactiveFormsModule, RouterLink
  ]
})
export class SharedModule { }
