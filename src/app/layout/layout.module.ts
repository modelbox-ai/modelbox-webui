import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { LayoutDefaultComponent } from './default/default.component';
import { LayoutFullComponent } from './full/full.component';

import { LeftmenuComponent } from './default/leftmenu/leftmenu.component';

const COMPONENTS = [
  LayoutDefaultComponent,
  LayoutFullComponent,
  LeftmenuComponent,
];

@NgModule({
  imports: [SharedModule],
  entryComponents: [],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA]
})
export class LayoutModule { }
