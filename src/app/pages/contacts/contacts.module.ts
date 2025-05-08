import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsListComponent } from './contactslist/contactslist.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ContactsListComponent,

  ],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    NgbModule,
    FormsModule
  ]
})
export class ContactsModule { }
