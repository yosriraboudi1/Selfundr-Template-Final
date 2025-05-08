import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageClientComponent } from './homepage-client.component';

describe('HomepageClientComponent', () => {
  let component: HomepageClientComponent;
  let fixture: ComponentFixture<HomepageClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomepageClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
