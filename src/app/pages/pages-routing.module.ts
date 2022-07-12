import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// main pages
import { MainComponent } from './main/main.component';
import { FirstComponent } from '../components/first/first.component';
import { SolutionComponent } from '../components/solution/solution.component';
import { ManagementComponent } from '../components/management/management.component';

export const routes: Routes = [
  {
    path: '',
    component: FirstComponent,
    canActivate: [],
    canActivateChild: [],
    children: [],
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [],
    canActivateChild: [],
    children: [],
  },
  {
    path: 'solution',
    component: SolutionComponent,
    canActivate: [],
    canActivateChild: [],
    children: [],
  },
  {
    path: 'management',
    component: ManagementComponent,
    canActivate: [],
    canActivateChild: [],
    children: [],
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA]
})
export class RouteRoutingModule { }
