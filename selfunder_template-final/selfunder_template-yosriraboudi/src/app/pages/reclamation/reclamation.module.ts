import { NgChartsModule } from 'ng2-charts';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReclamationRoutingModule } from './reclamation-routing.module';
import { ReclamationListComponent } from './reclamation-list/reclamation-list.component';
import { AddReclamationComponent } from './add-reclamation/add-reclamation.component';
import { FormsModule } from '@angular/forms';
import { ReclamationStatsComponent } from './reclamation-stats/reclamation-stats.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReclamationListByuserComponent } from './reclamation-list-byuser/reclamation-list-byuser.component';
// import { ReclamationclientListComponent } from './reclamationclient-list/reclamationclient-list.component';


@NgModule({
  declarations: [
    ReclamationListComponent,
    AddReclamationComponent,
    ReclamationStatsComponent,
    ReclamationListByuserComponent,
    // ReclamationclientListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule, // <-- Add this to enable ngModel
    NgChartsModule,
    ReactiveFormsModule,
    FormsModule,

    ReclamationRoutingModule
  ]
})
export class ReclamationModule { }
