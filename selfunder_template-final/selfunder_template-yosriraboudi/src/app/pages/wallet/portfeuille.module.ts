import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfeuilleRoutingModule } from './portfeuille-routing.module';
import { AddWalletComponent } from './add/add.component';
import { Home1Component } from './home1/home1.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PortfeuilleRoutingModule
  ]
})
export class PortfeuilleModule { }
