import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageClientRoutingModule } from './homepage-client-routing.module';
import { HomepageClientComponent } from './homepage-client/homepage-client.component';


@NgModule({
  declarations: [
    HomepageClientComponent
  ],
  imports: [
    CommonModule,
    HomepageClientRoutingModule
  ]
})
export class HomepageClientModule { }
