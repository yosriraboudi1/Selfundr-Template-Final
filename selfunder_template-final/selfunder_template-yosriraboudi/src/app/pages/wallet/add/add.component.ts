import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WalletService } from '../../../core/services/wallet.service';
import { Router } from '@angular/router';
import { Portfeuille, StatutPortfeuille } from '../../../core/models/wallet.model';

@Component({
  selector: 'app-add-wallet',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddWalletComponent {
  walletForm: FormGroup;
  currentPage = 1;
  totalPages = 2;
  isLoading = false;
  errorMessage: string | null = null; // Ajout pour afficher les erreurs à l'utilisateur

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private router: Router
  ) {
    this.walletForm = this.fb.group({
      idUser: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      valeurTotale: [0, [Validators.required, Validators.min(0)]],
      montantEpargne: [0, [Validators.required, Validators.min(0)]],
      montantInvestie: [0, [Validators.required, Validators.min(0)]],
      soldeDisponible: [0, [Validators.required, Validators.min(0)]],
      montantCredit: [0, [Validators.required, Validators.min(0)]],
      rendementPrevisionnel: [0, [Validators.required, Validators.min(0)]],
      dateCreation: [new Date().toISOString().split('T')[0], Validators.required],
      scoreFinancier: ['A', Validators.required],
      codePin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^[0-9]{4}$/)]], // Validation plus stricte pour le PIN
      qrCode: ['', Validators.required], // Rendre qrCode requis (à ajuster selon le backend)
      statutPortfeuille: [StatutPortfeuille.Actif, Validators.required]
    });
  }

  onSubmit() {
    if (this.walletForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      setTimeout(() => {
        this.isLoading = false;

        // Navigate to the wallet/apply page
        this.router.navigate(['/wallet/home1']);
      }, 1000);

      // Créer l'objet wallet à partir du formulaire
      const wallet: Portfeuille = this.walletForm.value;
      
      // S'assurer que idUser est un nombre
      wallet.idUser = Number(wallet.idUser);
      
      // Journaliser le payload pour débogage
      console.log('Payload envoyé au service:', wallet);

      this.walletService.createWallet(wallet).subscribe({
        next: (response) => {
          console.log('Portefeuille créé avec succès:', response);
          this.isLoading = false;
          this.router.navigate(['/success']);
        },
        error: (err) => {
          console.error('Erreur complète:', err);
          console.error('Réponse d’erreur:', err.error);
          this.isLoading = false;
          this.errorMessage = err.error?.message || err.message || 'Erreur lors de la création du portefeuille. Vérifiez vos données.';
          alert(this.errorMessage);
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs de validation
      Object.keys(this.walletForm.controls).forEach(key => {
        this.walletForm.get(key)?.markAsTouched();
      });
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
    }
  }

  nextPage() {
    if (this.isCurrentPageValid()) {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    } else {
      Object.keys(this.walletForm.controls).forEach(key => {
        this.walletForm.get(key)?.markAsTouched();
      });
      this.errorMessage = 'Veuillez compléter tous les champs requis sur cette page.';
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  isCurrentPageValid(): boolean {
    const controls = this.walletForm.controls;
    if (this.currentPage === 1) {
      return controls['idUser'].valid &&
             controls['valeurTotale'].valid &&
             controls['montantEpargne'].valid &&
             controls['montantInvestie'].valid &&
             controls['soldeDisponible'].valid &&
             controls['montantCredit'].valid;
    } else {
      return controls['rendementPrevisionnel'].valid &&
             controls['dateCreation'].valid &&
             controls['scoreFinancier'].valid &&
             controls['codePin'].valid &&
             controls['qrCode'].valid &&
             controls['statutPortfeuille'].valid;
    }
  }
}