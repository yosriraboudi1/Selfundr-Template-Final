import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelersComponent } from './travelers/travelers.component';

const routes: Routes = [
  {
    path: 'comptes',
    component: TravelersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompteBancaireRoutingModule { }
