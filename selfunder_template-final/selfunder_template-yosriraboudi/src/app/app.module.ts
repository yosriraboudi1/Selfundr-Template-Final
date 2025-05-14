import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import {PortfolioRoutingModule} from "./pages/portfolio/portfolio-routing.module";
import { ContactsListComponent } from './pages/contacts/contactslist/contactslist.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { InvestissementFormComponent } from './investissement-form/investissement-form.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PortfolioInvestissementsComponent } from './portfolio-investissements/portfolio-investissements.component';
// Suppression de l'import du ChatbotComponent car il est déjà déclaré dans HomepageClientModule
// import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { CompteBancaireModule } from './pages/compte-bancaire/compte-bancaire.module';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InvestissementFormComponent,
    PortfolioComponent,
    PortfolioInvestissementsComponent,




  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CompteBancaireModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ProfileComponent,
    PortfolioRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
