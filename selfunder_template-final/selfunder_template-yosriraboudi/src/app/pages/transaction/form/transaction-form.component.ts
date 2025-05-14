import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-lg border-0">
            <div class="card-header bg-primary text-white py-4">
              <h3 class="card-title mb-0 text-center">Bank Account Details</h3>
            </div>
            <div class="card-body p-5">
              <form [formGroup]="bankForm" (ngSubmit)="onSubmit()">
                <!-- Account Holder Name -->
                <div class="mb-4">
                  <label class="form-label">Account Holder Name</label>
                  <input type="text" class="form-control form-control-lg" formControlName="holderName" placeholder="Enter full name">
                  @if (bankForm.get('holderName')?.invalid && bankForm.get('holderName')?.touched) {
                    <div class="text-danger mt-1">Please enter account holder name</div>
                  }
                </div>

                <!-- Account Number -->
                <div class="mb-4">
                  <label class="form-label">Account Number</label>
                  <input type="text" class="form-control form-control-lg" formControlName="accountNumber" placeholder="Enter account number">
                  @if (bankForm.get('accountNumber')?.invalid && bankForm.get('accountNumber')?.touched) {
                    <div class="text-danger mt-1">Please enter a valid account number</div>
                  }
                </div>

                <!-- Bank Name -->
                <div class="mb-4">
                  <label class="form-label">Bank Name</label>
                  <select class="form-select form-select-lg" formControlName="bankName">
                    <option value="">Select your bank</option>
                    <option *ngFor="let bank of banks" [value]="bank.code">{{bank.name}}</option>
                  </select>
                  @if (bankForm.get('bankName')?.invalid && bankForm.get('bankName')?.touched) {
                    <div class="text-danger mt-1">Please select your bank</div>
                  }
                </div>

                <!-- Branch Code -->
                <div class="mb-4">
                  <label class="form-label">Branch Code</label>
                  <input type="text" class="form-control form-control-lg" formControlName="branchCode" placeholder="Enter branch code">
                  @if (bankForm.get('branchCode')?.invalid && bankForm.get('branchCode')?.touched) {
                    <div class="text-danger mt-1">Please enter branch code</div>
                  }
                </div>

                <!-- Account Type -->
                <div class="mb-4">
                  <label class="form-label">Account Type</label>
                  <div class="d-flex gap-3">
                    <div class="form-check">
                      <input class="form-check-input" type="radio" formControlName="accountType" value="savings" id="savings">
                      <label class="form-check-label" for="savings">Savings</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" formControlName="accountType" value="checking" id="checking">
                      <label class="form-check-label" for="checking">Checking</label>
                    </div>
                  </div>
                  @if (bankForm.get('accountType')?.invalid && bankForm.get('accountType')?.touched) {
                    <div class="text-danger mt-1">Please select account type</div>
                  }
                </div>

                <!-- Submit Button -->
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary btn-lg" [disabled]="!bankForm.valid || isSubmitting">
                    @if (isSubmitting) {
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>Saving...
                    } @else {
                      Save Bank Details
                    }
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-lg" (click)="cancel()">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-control, .form-select {
      border-radius: 0.5rem;
      padding: 1rem;
      font-size: 1rem;
    }
    .btn {
      border-radius: 0.5rem;
      padding: 1rem;
    }
  `]
})
export class TransactionFormComponent implements OnInit {
  bankForm: FormGroup;
  isSubmitting = false;
  
  banks = [
    { code: 'BOA', name: 'Bank of America' },
    { code: 'CHASE', name: 'Chase Bank' },
    { code: 'WELLS', name: 'Wells Fargo' },
    { code: 'CITI', name: 'Citibank' },
    { code: 'USB', name: 'U.S. Bank' }
  ];

  constructor(private fb: FormBuilder) {
    this.bankForm = this.fb.group({
      holderName: ['', [Validators.required]],
      accountNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      bankName: ['', [Validators.required]],
      branchCode: ['', [Validators.required, Validators.pattern('^[0-9]{4,6}$')]],
      accountType: ['', [Validators.required]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.bankForm.valid) {
      this.isSubmitting = true;
      // Simulate API call
      setTimeout(() => {
        console.log('Bank details saved:', this.bankForm.value);
        this.isSubmitting = false;
        alert('Bank details saved successfully!');
      }, 1500);
    } else {
      Object.keys(this.bankForm.controls).forEach(key => {
        const control = this.bankForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  cancel() {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      // Navigate back or clear form
      this.bankForm.reset();
    }
  }
}