import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SamplePageComponent } from './sample-page/sample-page.component';
import { HomeComponent } from '../home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [

        // { path: '', redirectTo: 'sample-page', pathMatch: 'full' },

        // { path: 'sample-page', component: SamplePageComponent },
        {
          path: '', component: HomeComponent,
          children: [
            {path:'',redirectTo:'dashboard',pathMatch:'full'},
            {path:'dashboard',component:DashboardComponent},
            {path:'sample-page',component:SamplePageComponent},

          ]

        }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraRoutingModule { }
