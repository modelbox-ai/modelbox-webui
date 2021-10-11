import { NgModule } from '@angular/core';
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
})
export class LayoutModule {}
