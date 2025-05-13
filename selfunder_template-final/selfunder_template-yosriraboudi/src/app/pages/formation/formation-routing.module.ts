import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormationfrontComponent } from './formationfront/formationfront.component';
import { ListformationComponent } from './listformation/listformation.component';
import { FormationformComponent } from './formationform/formationform.component';

const routes: Routes = [
  { path: 'front', component: FormationfrontComponent },
  { path: 'list', component: ListformationComponent },
  { path: 'add', component: FormationformComponent },
  { path: 'edit/:id', component: FormationformComponent },
  { path: '', redirectTo: 'front', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormationRoutingModule { }
