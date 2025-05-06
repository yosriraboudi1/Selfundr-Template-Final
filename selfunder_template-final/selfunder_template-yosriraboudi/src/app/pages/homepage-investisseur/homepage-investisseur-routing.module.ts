import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageInvestisseurComponent } from './homepage-investisseur/homepage-investisseur.component';

const routes: Routes = [
   {
              path: '', component: HomepageInvestisseurComponent,
              children: [
                {path:'',redirectTo:'homepageinvestisseur',pathMatch:'full'},





              ]

            }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageInvestisseurRoutingModule { }
