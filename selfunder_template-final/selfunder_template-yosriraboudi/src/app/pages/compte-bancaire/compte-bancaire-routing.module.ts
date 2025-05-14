import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelersComponent } from './travelers/travelers.component';
import { CompteFormComponent } from './form/compte-form.component';

const routes: Routes = [
  { path: '', component: TravelersComponent },
  { path: 'add', component: CompteFormComponent },
  { path: 'comptes', component: TravelersComponent },
  { path: 'comptes/edit/:id', component: CompteFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompteBancaireRoutingModule { }