import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutFullComponent } from '../layout/full/full.component';
// main pages
import { MainComponent } from './main/main.component';
import { FirstComponent } from '../components/first/first.component';
import { SolutionComponent } from '../components/solution/solution.component';
import { ManagementComponent } from '../components/management/management.component';

const routes: Routes = [
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
})
export class RouteRoutingModule { }
