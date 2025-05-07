import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageEntreproneurRoutingModule } from './homepage-entreproneur-routing.module';
import { HomepageEntreproneurComponent } from './homepage-entreproneur/homepage-entreproneur.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomepageEntreproneurComponent
  ],
  imports: [
    CommonModule,
    HomepageEntreproneurRoutingModule,
    FormsModule,
  ]
})
export class HomepageEntreproneurModule { }
