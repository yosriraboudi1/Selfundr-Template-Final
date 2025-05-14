import { Component, TemplateRef, inject } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CompteBancaireService } from '../../../core/services/compte-bancaire.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export enum TypeCompteBancaire {
  COURANT = 'COURANT',
  EPARGNE = 'EPARGNE',
  PROFESSIONNEL = 'PROFESSIONNEL'
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
  selector: 'app-bank-accounts',
  templateUrl: './travelers.component.html',
  styleUrls: ['./travelers.component.scss']
})
export class TravelersComponent {
  compteForm: FormGroup;
  private modalService = inject(NgbModal)
  comptesBancaires: CompteBancaire[] = [];
  protected TypeCompteBancaire = TypeCompteBancaire;
  compteToDelete: CompteBancaire | null = null;
  editedCompteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private compteService: CompteBancaireService
  ) {
    this.compteForm = this.fb.group({
      IBAN: ['', Validators.required],
      rib: ['', Validators.required],
      codeBanque: ['', Validators.required],
      solde: [0, Validators.required],
      devise: ['', Validators.required],
      typeCompteBancaire: ['', Validators.required]
    });
  }

  openModal(content: TemplateRef<any>) {
    this.editedCompteId = null; // Reset editing state for creation
    this.compteForm.reset();     // Clear the form
    this.modalService.open(content, {
      size: 'lg',
      ariaLabelledBy: 'modal-title',
      keyboard: true,
      backdrop: 'static'
    });
  }

  openEditModal(content: TemplateRef<any>, compte: CompteBancaire): void {
    this.editedCompteId = compte.idCompte ?? null;
    this.compteForm.setValue({
      IBAN: compte.iban,
      rib: compte.rib,
      codeBanque: compte.codeBanque,
      solde: compte.solde,
      devise: compte.devise,
      typeCompteBancaire: compte.typeCompteBancaire
    });

    this.modalService.open(content, {
      size: 'lg',
      ariaLabelledBy: 'modal-title-edit',
      keyboard: true,
      backdrop: 'static'
    });
  }

  formatIBAN(iban: string): string {
    if (!iban) return 'no iban';
    const cleaned = iban.replace(/\s/g, '');
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  }

  formatRIB(rib: string): string {
    if (!rib) return '';
    const cleaned = rib.replace(/[^0-9a-zA-Z]/g, '');
    return cleaned.replace(/(.{5})/g, '$1 ').trim();
  }

  getAccountTypeLabel(type: TypeCompteBancaire): string {
    switch (type) {
      case TypeCompteBancaire.COURANT:
        return 'COURANT';
      case TypeCompteBancaire.EPARGNE:
        return 'EPARGNE';
      case TypeCompteBancaire.PROFESSIONNEL:
        return 'Professional Account';
      default:
        return 'Unknown Account Type';
    }
  }

  getAccountIcon(type: TypeCompteBancaire): string {
    switch (type) {
      case TypeCompteBancaire.COURANT:
        return 'bi-wallet2';
      case TypeCompteBancaire.EPARGNE:
        return 'bi-piggy-bank';
      case TypeCompteBancaire.PROFESSIONNEL:
        return 'bi-briefcase';
      default:
        return 'bi-bank';
    }
  }

  onSubmit(): void {
    if (this.compteForm.invalid) return;

    const compteData = {
      ...this.compteForm.value,
      iban: this.compteForm.value.IBAN // Ensure IBAN is mapped correctly
    };

    const userId = 1; // Replace with real user ID from session/login

    if (this.editedCompteId) {
      this.compteService.updateCompte({ ...compteData, idCompte: this.editedCompteId })

        .subscribe({
          next: () => {
            alert('Compte mis à jour avec succès!');
            this.loadAccounts();
            this.modalService.dismissAll();
            this.editedCompteId = null;
          },
          error: err => {
            console.error('Erreur lors de la mise à jour:', err);
            alert('Échec de la mise à jour');
          }
        });
    } else {
      this.compteService.createCompte(userId, compteData)
        .subscribe({
          next: () => {
            alert('Compte créé avec succès!');
            this.loadAccounts();
            this.modalService.dismissAll();
          },
          error: err => console.error('Erreur lors de la création:', err)
        });
    }
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.compteService.getComptesByUser(1).subscribe({
      next: (data) => {
        this.comptesBancaires = data;
        console.log('Loaded accounts:', data);
      },
      error: (err) => console.error('Failed to load accounts:', err)
    });
  }

  openDeleteModal(content: TemplateRef<any>, compte: CompteBancaire) {
    this.compteToDelete = compte;
    this.modalService.open(content, {
      centered: true,
      ariaLabelledBy: 'modal-title-delete'
    });
  }

  deleteCompte(): void {
    if (!this.compteToDelete || !this.compteToDelete.idCompte) return;

    this.compteService.deleteCompte(this.compteToDelete.idCompte)
      .subscribe({
        next: () => {
          this.comptesBancaires = this.comptesBancaires.filter(
            c => c.idCompte !== this.compteToDelete?.idCompte
          );
          this.modalService.dismissAll();
          alert('Compte supprimé avec succès');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Échec de la suppression');
        }
      });
  }
}
