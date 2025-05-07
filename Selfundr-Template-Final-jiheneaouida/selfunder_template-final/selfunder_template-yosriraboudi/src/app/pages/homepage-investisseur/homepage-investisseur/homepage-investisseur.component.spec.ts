import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageInvestisseurComponent } from './homepage-investisseur.component';

describe('HomepageInvestisseurComponent', () => {
  let component: HomepageInvestisseurComponent;
  let fixture: ComponentFixture<HomepageInvestisseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomepageInvestisseurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageInvestisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
