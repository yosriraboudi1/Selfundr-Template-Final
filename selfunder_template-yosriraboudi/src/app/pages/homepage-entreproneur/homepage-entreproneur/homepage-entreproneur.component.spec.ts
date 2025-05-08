import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageEntreproneurComponent } from './homepage-entreproneur.component';

describe('HomepageEntreproneurComponent', () => {
  let component: HomepageEntreproneurComponent;
  let fixture: ComponentFixture<HomepageEntreproneurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomepageEntreproneurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageEntreproneurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
