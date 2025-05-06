import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from '../homepage/homepage/homepage.component';
import { HomepageClientComponent } from './homepage-client/homepage-client.component';

const routes: Routes = [
   {
              path: '', component: HomepageClientComponent,
              children: [
                {path:'',redirectTo:'homepageclient',pathMatch:'full'},





              ]

            }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageClientRoutingModule { }
