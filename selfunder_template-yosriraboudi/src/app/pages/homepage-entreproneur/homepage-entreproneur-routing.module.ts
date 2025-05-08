import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from '../homepage/homepage/homepage.component';
import { HomepageEntreproneurComponent } from './homepage-entreproneur/homepage-entreproneur.component';

const routes: Routes = [
   {
              path: '', component: HomepageEntreproneurComponent,
              children: [
                {path:'',redirectTo:'homepageentreproneur',pathMatch:'full'},





              ]

            }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageEntreproneurRoutingModule { }
