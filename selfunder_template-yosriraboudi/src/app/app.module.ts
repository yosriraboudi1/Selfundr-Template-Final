import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './pages/home/home.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PortfolioRoutingModule } from './pages/portfolio/portfolio-routing.module';
import { InvestissementFormComponent } from './investissement-form/investissement-form.component';
import { PortfolioInvestissementsComponent } from './portfolio-investissements/portfolio-investissements.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PortfolioComponent,
    InvestissementFormComponent,
    PortfolioInvestissementsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    PortfolioRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
