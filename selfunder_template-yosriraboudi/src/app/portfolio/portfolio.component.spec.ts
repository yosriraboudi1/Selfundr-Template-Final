import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PortfolioComponent } from './portfolio.component';
import { PortfolioService } from '../services/portfolio.service';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortfolioComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [PortfolioService]
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load portfolios on init', () => {
    expect(component.portfolios).toEqual([]);
    expect(component.errorMessage).toBeNull();
  });

  it('should toggle form visibility', () => {
    expect(component.showForm).toBeFalse();
    component.toggleForm();
    expect(component.showForm).toBeTrue();
    component.toggleForm();
    expect(component.showForm).toBeFalse();
  });
});