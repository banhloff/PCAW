import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RoutesRoutingModule } from './routes-routing.module';

import { DatePipe } from '@angular/common';
const COMPONENTS: never[] = [];
const COMPONENTS_DYNAMIC: never[] = [];

@NgModule({
  imports: [ RoutesRoutingModule],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true }
    DatePipe
  ],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class RoutesModule {
}
