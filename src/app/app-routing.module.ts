import { ReclamationListByuserComponent } from './pages/reclamation/reclamation-list-byuser/reclamation-list-byuser.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ReclamationStatsComponent } from './pages/reclamation/reclamation-stats/reclamation-stats.component';
import { HomepageComponent } from './pages/homepage/homepage/homepage.component';
import { HomepageClientComponent } from './pages/homepage-client/homepage-client/homepage-client.component';
import { HomepageEntreproneurComponent } from './pages/homepage-entreproneur/homepage-entreproneur/homepage-entreproneur.component';
import { HomepageInvestisseurComponent } from './pages/homepage-investisseur/homepage-investisseur/homepage-investisseur.component';
import { ContactsListComponent } from './pages/contacts/contactslist/contactslist.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'homepage',
    pathMatch: 'full'
  },
  {path: 'homepage', loadChildren: () => import('./pages/homepage/homepage.module').then(m => m.HomepageModule)},
  {path: 'auth', loadChildren: () => import('./pages/authentication/authentication.module').then(m => m.AuthenticationModule)},
  {path: 'extra', loadChildren: () => import('./pages/extra/extra.module').then(m => m.ExtraModule)},
  {path: 'reclamation', loadChildren: () => import('./pages/reclamation/reclamation.module').then(m => m.ReclamationModule)},
  {path: 'homepageclient', loadChildren: () => import('./pages/homepage-client/homepage-client.module').then(m => m.HomepageClientModule)},
  {path: 'homepageentreproneur', loadChildren: () => import('./pages/homepage-entreproneur/homepage-entreproneur.module').then(m => m.HomepageEntreproneurModule)},
  {path: 'homepageinvestisseur', loadChildren: () => import('./pages/homepage-investisseur/homepage-investisseur.module').then(m => m.HomepageInvestisseurModule)},
  {path: 'contacts', loadChildren: () => import('./pages/contacts/contacts.module').then(m => m.ContactsModule)},
  {path: 'formation', loadChildren: () => import('./pages/formation/formation.module').then(m => m.FormationModule)},

  // {path:'',component:HomeComponent},
  {path:'home',component:HomeComponent},
  { path: 'homepage-client/homepage-client', component: HomepageClientComponent },
  { path: 'homepage-entreproneur/homepage-entreproneur', component: HomepageEntreproneurComponent },
  { path: 'homepage-investisseur/homepage-investisseur', component: HomepageInvestisseurComponent },
  { path: 'reclamation/listbyuser', component: ReclamationListByuserComponent },
  { path: 'contact/contactlist', component: ContactsListComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
