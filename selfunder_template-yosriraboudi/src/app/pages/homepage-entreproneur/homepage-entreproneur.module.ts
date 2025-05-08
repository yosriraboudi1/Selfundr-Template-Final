import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageEntreproneurRoutingModule } from './homepage-entreproneur-routing.module';
import { HomepageEntreproneurComponent } from './homepage-entreproneur/homepage-entreproneur.component';


@NgModule({
  declarations: [
    HomepageEntreproneurComponent
  ],
  imports: [
    CommonModule,
    HomepageEntreproneurRoutingModule
  ]
})
export class HomepageEntreproneurModule { }
