import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddWalletComponent } from './add.component';

// import { AddComponent } from './add.component';

describe('AddComponent', () => {
  let component: AddWalletComponent;
  let fixture: ComponentFixture<AddWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddWalletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
