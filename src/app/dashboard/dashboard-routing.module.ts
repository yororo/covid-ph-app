import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      { path: 'dashboard', component: DashboardComponent }
    ]),
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutingModule { }