import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatToolbarModule } from "@angular/material/toolbar";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {SharedModule} from "../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LayoutRoutingModule} from "./Layout.routing";

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule, MatPaginatorModule, MatTableModule,FormsModule, ReactiveFormsModule,
    MatIconModule, LayoutRoutingModule, MatToolbarModule, MatFormFieldModule, MatProgressSpinnerModule, SharedModule, ReactiveFormsModule
  ]
})
export class LayoutModuleModule { }
