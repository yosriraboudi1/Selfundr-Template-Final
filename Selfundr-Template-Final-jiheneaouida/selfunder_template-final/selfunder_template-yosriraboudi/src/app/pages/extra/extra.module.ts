import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtraRoutingModule } from './extra-routing.module';
import { SamplePageComponent } from './sample-page/sample-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    SamplePageComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ExtraRoutingModule
  ]
})
export class ExtraModule { }
