import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ReclamationListComponent } from '../reclamation/reclamation-list/reclamation-list.component';
import { AddReclamationComponent } from '../reclamation/add-reclamation/add-reclamation.component';
import { ReclamationStatsComponent } from '../reclamation/reclamation-stats/reclamation-stats.component';

const routes: Routes = [
   {
              path: '', component: HomepageComponent,
              children: [
                {path:'',redirectTo:'homepage',pathMatch:'full'},
              




              ]

            }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageRoutingModule { }
