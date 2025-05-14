import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {InvestissementService} from "../Service/investissement.service";
import { Investissement, StatutInvestissement, ModePaiement } from '../models/investissement';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-investissement-form',
  templateUrl: './investissement-form.component.html',
  styleUrls: ['./investissement-form.component.css']
})
export class InvestissementFormComponent implements OnInit {
  investissementForm: FormGroup;
  modePaiementOptions: ModePaiement[] = [ModePaiement.CARTE_BANCAIRE, ModePaiement.VIREMENT];
  portfolioId: number = 0;
  userId = 1; // Replace with actual user ID (e.g., from auth service)
  errorMessage: string | null = null;
  successMessage: string | null = null;
  ModePaiement = ModePaiement; // Expose enum to template

  constructor(
    private fb: FormBuilder,
    private investissementService: InvestissementService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.investissementForm = this.fb.group({
      montantInvestissement: ['', [Validators.required, Validators.min(0.01)]],
      pourcentageParticipation: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      rendementEstime: ['', [Validators.required, Validators.min(0)]],
      dureeEngagement: ['', [Validators.required, Validators.min(1)]],
      modePaiement: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.portfolioId = +params['id'];
      } else {
        this.errorMessage = 'No portfolio selected. Please select a portfolio to invest in.';
      }
    });
  }

  getPaymentDisplayName(mode: ModePaiement): string {
    return mode === ModePaiement.CARTE_BANCAIRE ? 'Credit Card' : 'Bank Transfer';
  }

  getPaymentIcon(mode: ModePaiement): string {
    switch (mode) {
      case ModePaiement.CARTE_BANCAIRE:
        return 'fas fa-credit-card';
      case ModePaiement.VIREMENT:
        return 'fas fa-university';
      default:
        return 'fas fa-money-bill';
    }
  }

  getPaymentDescription(mode: ModePaiement): string {
    switch (mode) {
      case ModePaiement.CARTE_BANCAIRE:
        return 'Secure credit card payment';
      case ModePaiement.VIREMENT:
        return 'Direct bank transfer';
      default:
        return '';
    }
  }

  onSubmit(): void {
    if (this.investissementForm.valid && this.portfolioId > 0) {
      const investissement: Investissement = {
        ...this.investissementForm.value,
        statutInvestissement: StatutInvestissement.PENDING,
        portfolioId: this.portfolioId,
        userId: this.userId
      };

      this.investissementService.createInvestissement(this.userId, this.portfolioId, investissement)
        .subscribe({
          next: (response) => {
            console.log('Investment created successfully:', response);
            this.successMessage = 'L\'investissement a été soumis avec succès';
            setTimeout(() => {
              this.successMessage = null;
              this.router.navigate(['/portfolio']);
            }, 2000);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error creating investment:', {
              status: err.status,
              statusText: err.statusText,
              message: err.message,
              error: err.error
            });
            this.errorMessage = this.getErrorMessage(err);
          }
        });
    } else {
      this.errorMessage = 'Please fill in all required fields and ensure a portfolio is selected.';
    }
  }

  getErrorMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Unable to connect to the server. Please check if the backend is running.';
    } else if (err.status >= 500) {
      return 'Server error occurred. Please try again later or contact support.';
    } else if (err.status === 404) {
      return 'Investment endpoint not found. Please verify the backend API.';
    } else if (err.status === 400) {
      return err.error?.message || 'Invalid investment data. Please check your inputs.';
    } else if (err.status === 403 || err.status === 401) {
      return 'Access denied. Please check authentication settings.';
    }
    return 'Failed to create investment. Please try again.';
  }

  onCancel(): void {
    this.router.navigate(['/portfolio']);
  }

}
