import { NgModule } from '@angular/core';
import { AngularSplitModule } from "angular-split";
import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './pages-routing.module';
// main pages
import { MainComponent } from './main/main.component';
import { TextEditorComponent } from '../components/text-editor/text-editor.component';
import { InsertPanelsComponent } from '../components/insert-panels/insert-panels.component';
import { GraphComponent } from '../components/graph/graph.component';
import { ManagementComponent } from '../components/management/management.component';
import { SplitterModule } from 'ng-devui/splitter';
import { SearchModule } from 'ng-devui/search';
import { DataTableModule } from 'ng-devui/data-table';
import { ModalModule } from 'ng-devui/modal';
import { AccordionModule } from 'ng-devui/accordion';
import { RadioModule } from 'ng-devui';
import { CheckBoxModule } from 'ng-devui';
import { ToastModule } from 'ng-devui/toast';
import { SelectModule } from 'ng-devui/select';
import { ToolBarComponent } from '../components/tool-bar/tool-bar.component';
import { LayoutModule } from 'ng-devui';
import { AttributePanelComponent } from '../components/attribute-panel/attribute-panel.component';
import { FormsModule } from '@angular/forms';
import { FormModule } from 'ng-devui/form';
import { HeaderMainComponent } from '../components/header-main/header-main.component';
import { FirstComponent } from '../components/first/first.component';
import { ButtonModule } from 'ng-devui/button';
import { TooltipModule } from 'ng-devui/tooltip';
import { TabsModule } from 'ng-devui/tabs';
import { HttpClientModule } from '@angular/common/http';
import { ModalSaveAsComponent } from '../components/modal-save-as/modal-save-as.component';
import { DrawerModule } from 'ng-devui/drawer';
import { NgbdTooltipCustomclass } from '../components/tooltip/tooltip-customclass';
import { PopoverModule } from 'ng-devui/popover';
import { DropDownModule } from 'ng-devui/dropdown';
import { BrowserModule } from '@angular/platform-browser';
import { LoadingModule } from 'ng-devui/loading';
import { StepsGuideModule } from 'ng-devui/steps-guide';
// DevUI部分组件依赖angular动画，需要引入animations模块
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DevUIModule } from 'ng-devui';
import { BadgeModule } from 'ng-devui/badge';
import { SolutionComponent } from '../components/solution/solution.component';
import { ToolBarSolutionComponent } from '../components/tool-bar-solution/tool-bar-solution.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AceModule, AceConfigInterface, ACE_CONFIG } from 'ngx-ace-wrapper';
import { ShowdownModule } from 'ngx-showdown';
import { ModalGuideComponent } from '../components/modal-guide/modal-guide.component';


const COMPONENTS = [MainComponent];
const COMPONENTS_NOROUNT = [];
const DEFAULT_ACE_CONFIG: AceConfigInterface = {
  tabSize: 2
};

@NgModule({
  imports: [
    SharedModule,
    RouteRoutingModule,
    AceModule,
    ButtonModule,
    PopoverModule,
    DropDownModule,
    TabsModule,
    NgxJsonViewerModule,
    BadgeModule,
    SplitterModule,
    TooltipModule,
    LayoutModule,
    SearchModule,
    DataTableModule,
    ModalModule,
    HttpClientModule,
    AccordionModule,
    RadioModule,
    CheckBoxModule,
    ToastModule,
    DrawerModule,
    SelectModule,
    FormsModule,
    FormModule,
    AngularSplitModule,
    BrowserModule,
    LoadingModule,
    StepsGuideModule,
    BrowserAnimationsModule,
    DevUIModule,
    ShowdownModule.forRoot({emoji: true, noHeaderId: true, flavor: 'github'}),
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    TextEditorComponent,
    InsertPanelsComponent,
    GraphComponent,
    ToolBarComponent,
    AttributePanelComponent,
    HeaderMainComponent,
    ToolBarSolutionComponent,
    FirstComponent,
    SolutionComponent,
    ManagementComponent,
    ModalSaveAsComponent,
    NgbdTooltipCustomclass,
    ModalGuideComponent,
  ],
  providers: [
    {
      provide: ACE_CONFIG,
      useValue: DEFAULT_ACE_CONFIG
    }
  ],
  entryComponents: COMPONENTS_NOROUNT,
})
export class PagesModule { }
