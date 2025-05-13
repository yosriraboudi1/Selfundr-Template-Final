import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestissementFormComponent } from './investissement-form.component';

describe('InvestissementFormComponent', () => {
  let component: InvestissementFormComponent;
  let fixture: ComponentFixture<InvestissementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvestissementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestissementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
