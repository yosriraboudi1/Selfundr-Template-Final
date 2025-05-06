import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationListByuserComponent } from './reclamation-list-byuser.component';

describe('ReclamationListByuserComponent', () => {
  let component: ReclamationListByuserComponent;
  let fixture: ComponentFixture<ReclamationListByuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReclamationListByuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReclamationListByuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
