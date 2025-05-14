import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CompteBancaireRoutingModule } from './compte-bancaire-routing.module';
import { TravelersComponent } from './travelers/travelers.component';
import { CompteFormComponent } from './form/compte-form.component';

@NgModule({
  declarations: [TravelersComponent, CompteFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    CompteBancaireRoutingModule,
  ],
})
export class CompteBancaireModule {}