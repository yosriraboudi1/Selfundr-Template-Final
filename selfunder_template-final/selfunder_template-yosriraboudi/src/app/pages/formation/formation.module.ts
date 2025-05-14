import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

import { FormationRoutingModule } from './formation-routing.module';
import { FormationformComponent } from './formationform/formationform.component';
import { ListformationComponent } from './listformation/listformation.component';
import { FormationfrontComponent } from './formationfront/formationfront.component';


@NgModule({
  declarations: [
    FormationformComponent,
    ListformationComponent,
    FormationfrontComponent
  ],
  imports: [
    CommonModule,
    FormationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgChartsModule
  ]
})
export class FormationModule { }
