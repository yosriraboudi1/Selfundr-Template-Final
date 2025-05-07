import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageInvestisseurRoutingModule } from './homepage-investisseur-routing.module';
import { HomepageInvestisseurComponent } from './homepage-investisseur/homepage-investisseur.component';


@NgModule({
  declarations: [
    HomepageInvestisseurComponent
  ],
  imports: [
    CommonModule,
    HomepageInvestisseurRoutingModule
  ]
})
export class HomepageInvestisseurModule { }
