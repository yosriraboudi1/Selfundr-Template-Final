import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home1Component } from '../wallet/home1/home1.component';
import { AddWalletComponent } from './add/add.component';
import { HomeComponent } from '../home/home.component';
import { HomepageClientComponent } from '../homepage-client/homepage-client/homepage-client.component';

const routes: Routes = [
  { 
    path: '', 
    component: Home1Component,
    children: [
      {path:'',redirectTo:'home1',pathMatch:'full'},
      {path:'home1',component:Home1Component},
    ]
    
  },
  // {
  //   path: 'add',
  //   component: AddWalletComponent,
  //   data: { title: 'Create New Wallet' }
  // }
  {
              path: '', component: AddWalletComponent,
  
              children: [
                {path:'',redirectTo:'apply',pathMatch:'full'},
                {path:'apply',component:AddWalletComponent},


                
  
                          ],
            },
            // {
            //   path: '', component: Home1Component,
  
            //   children: [
            //     {path:'',redirectTo:'home1',pathMatch:'full'},
            //     {path:'home1',component:Home1Component},
  
            //               ],
            // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortfeuilleRoutingModule { }
