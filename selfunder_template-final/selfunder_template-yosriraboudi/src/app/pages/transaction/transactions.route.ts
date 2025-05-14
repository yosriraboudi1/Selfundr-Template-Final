import { Routes } from '@angular/router'
import { HomeTrComponent } from './home/home.component'
import { TransactionFormComponent } from './form/transaction-form.component'

export const TRANSACTIONS_ROUTES: Routes = [
  {
    path: 'home',
    component: HomeTrComponent
  },
  {
    path: ':type',
    component: TransactionFormComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
] 