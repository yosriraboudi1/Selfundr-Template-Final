import { HomeComponent } from '../home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsListComponent } from './contactslist/contactslist.component';

const routes: Routes = [


  {
    path: '', // Chemin de base
    component: HomeComponent, // Utilisez HomeComponent comme wrapper
    children: [
      {path:'',redirectTo:'contactlist',pathMatch:'full'},

      { path: 'contactlist', component: ContactsListComponent }, // Tableau des contacts
    ],
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
