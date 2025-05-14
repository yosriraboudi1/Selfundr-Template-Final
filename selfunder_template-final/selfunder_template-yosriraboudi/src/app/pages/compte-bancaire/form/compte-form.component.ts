import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompteBancaireService } from '../../../core/services/compte-bancaire.service';
import { TypeCompteBancaire } from '../travelers/travelers.component';
import { HttpErrorResponse } from '@angular/common/http';

interface CompteForm {
  typeCompteBancaire: AbstractControl;
  solde: AbstractControl;
  devise: AbstractControl;
}
export interface CompteBancaire {
  idCompte?: number;
  iban: string;
  rib: string;
  codeBanque: string;
  solde: number;
  devise: string;
  typeCompteBancaire: TypeCompteBancaire;
}

@Component({
  selector: 'app-compte-form',
  templateUrl: './compte-form.component.html',
  styleUrls: ['./compte-form.component.scss']
})
export class CompteFormComponent implements OnInit {
  compteForm: FormGroup;
  TypeCompteBancaire = TypeCompteBancaire;
  comptesBancaires: CompteBancaire[] = [];
  devises = ['EUR', 'USD', 'GBP', 'JPY', 'CAD'];
  submitted = false;
  editedCompteId: number | null = null;

  typesCompte = [
    { value: 'COURANT', label: 'Compte Courant' },
    { value: 'EPARGNE', label: 'Compte Épargne' },
    { value: 'PROFESSIONNEL', label: 'Compte Professionnel' }
  ];

  constructor(
    private fb: FormBuilder,
    private compteService: CompteBancaireService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.compteForm = this.fb.group({
      typeCompteBancaire: ['', Validators.required],
      solde: [0, [
        Validators.required,
        Validators.min(0),
        this.validateDecimalPlaces(2)
      ]],
      devise: ['', [
        Validators.required,
        Validators.pattern(/^[A-Z]{3}$/),
        this.validateDevise.bind(this)
      ]]
    });
  }

  ngOnInit(): void {
    // Check if we're in edit mode by fetching the id from the URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editedCompteId = +id;
      this.compteService.getCompteById(this.editedCompteId).subscribe({
        next: (compte) => {
          this.compteForm.patchValue({
            typeCompteBancaire: compte.typeCompteBancaire,
            solde: compte.solde,
            devise: compte.devise
          });
        },
        error: (err) => {
          console.error('Erreur chargement compte:', err);
          alert("Impossible de charger le compte.");
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.compteForm.valid) {
      const compteData = this.compteForm.value;

      // Get userId from somewhere, for example, from localStorage, user service, or route
      const userId = 1;  // Replace with actual userId retrieval logic

      // If editing, add the compteId to the form data
      if (this.editedCompteId) {
        compteData.idCompte = this.editedCompteId;  // Use the editedCompteId for editing
        this.compteService.updateCompte(compteData).subscribe({
          next: (response) => {
            // Update the local list of accounts after the account is updated
            this.loadAccounts(); // This method should refresh the list of accounts
            this.router.navigate(['/comptes']);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error during update:', err);
            alert(`Erreur lors de la modification du compte : ${err.message}`);
          }
        });
      } else {
        // If creating, ensure no id is sent
        this.compteService.createCompte(userId, compteData).subscribe({
          next: (response) => {
            this.router.navigate(['/comptes']);
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
            alert(`Erreur lors de la création du compte : ${err.message}`);
          }
        });
      }
    } else {
      this.compteForm.markAllAsTouched();
    }
  }

  // Validators
  validateDecimalPlaces(decimalPlaces: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === null || value === '') return null;

      const regex = new RegExp(`^-?\\d+(\\.\\d{1,${decimalPlaces}})?$`);
      if (!regex.test(value.toString())) {
        return { decimalPlaces: { requiredDecimalPlaces: decimalPlaces, actualValue: value } };
      }
      return null;
    };
  }

  validateDevise(control: AbstractControl): { [key: string]: any } | null {
    if (!this.devises.includes(control.value)) {
      return { invalidDevise: true };
    }
    return null;
  }

  get f(): CompteForm {
    return {
      typeCompteBancaire: this.compteForm.get('typeCompteBancaire')!,
      solde: this.compteForm.get('solde')!,
      devise: this.compteForm.get('devise')!
    };
  }

  getAccountTypeLabel(type: TypeCompteBancaire): string {
    return type.toString();
  }
  loadAccounts(): void {
    this.compteService.getComptesByUser(1).subscribe({
      next: (data) => {
        this.comptesBancaires = data;
        console.log('Loaded accounts:', data);
      },
      error: (err) => console.error('Failed to load accounts:', err)
    });
  }}
