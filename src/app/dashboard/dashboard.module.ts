import { NgModule } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [ 
      DashboardComponent 
    ],
  imports: [
    NgxChartsModule,
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }