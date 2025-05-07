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
  idCompte?: number;  // Make it optional
  IBAN: string;
  rib: string;
  codeBanque: string;
  solde: number;
  devise: string;
  typeCompteBancaire: TypeCompteBancaire;
}


@Component({
  selector: 'app-bank-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './travelers.component.html',
  styleUrls: ['./travelers.component.scss']
})
export class TravelersComponent {
  compteForm: FormGroup;
  private modalService = inject(NgbModal)
  comptesBancaires: CompteBancaire[]=[]
  // Expose enum to template
  protected TypeCompteBancaire = TypeCompteBancaire;
  
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
    this.modalService.open(content, { size: 'lg' });
  }

  formatIBAN(iban: string | undefined) {
    if (!iban) {
      console.error('IBAN is undefined!');
      return 'Invalid IBAN';
    }
    return iban.replace(/(.{4})/g, '$1 ');
  }
  

  formatRIB(rib: string): string {
    return rib.replace(/(.{5})/g, '$1 ').trim();
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
    if (this.compteForm.valid) {
      const userId = 1; // <-- Replace with actual user ID (e.g., from login/session)
      this.compteService.createCompte(userId, this.compteForm.value)
        .subscribe({
          next: res => alert('Compte créé avec succès!'),
          error: err => console.error('Erreur lors de la création:', err)
        });
    }
}
ngOnInit(): void {
  this.loadAccounts();
}
loadAccounts(): void {
  this.compteService.getAllComptes().subscribe({
    next: (data) => {
      this.comptesBancaires = data;
      console.log('Loaded accounts:', data); // ✅ You'll now see this in the console
    },
    error: (err) => console.error('Failed to load accounts:', err)
  });
}

}
