import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioInvestissementsComponent } from './portfolio-investissements.component';

describe('PortfolioInvestissementsComponent', () => {
  let component: PortfolioInvestissementsComponent;
  let fixture: ComponentFixture<PortfolioInvestissementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortfolioInvestissementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioInvestissementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
