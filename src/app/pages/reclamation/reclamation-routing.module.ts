import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ReclamationListComponent } from './reclamation-list/reclamation-list.component';
import { AddReclamationComponent } from './add-reclamation/add-reclamation.component';
import { ReclamationStatsComponent } from './reclamation-stats/reclamation-stats.component';
import { HomepageComponent } from '../homepage/homepage/homepage.component';
import { HomepageClientComponent } from '../homepage-client/homepage-client/homepage-client.component';
import { ReclamationListByuserComponent } from './reclamation-list-byuser/reclamation-list-byuser.component';

const routes: Routes = [
    {
            path: '', component: AddReclamationComponent,
            children: [
              {path:'add',component:AddReclamationComponent},
              { path:'reclamation/listbyuser', component: ReclamationListByuserComponent },



            ]

          },
          {
            path: '', component: HomeComponent,

            children: [
              {path:'',redirectTo:'list',pathMatch:'full'},
              {path:'list',component:ReclamationListComponent},

              {path: 'stats', component: ReclamationStatsComponent },            ],
          },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReclamationRoutingModule { }
