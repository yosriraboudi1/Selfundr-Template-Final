import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationformComponent } from './formationform.component';

describe('FormationformComponent', () => {
  let component: FormationformComponent;
  let fixture: ComponentFixture<FormationformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormationformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
