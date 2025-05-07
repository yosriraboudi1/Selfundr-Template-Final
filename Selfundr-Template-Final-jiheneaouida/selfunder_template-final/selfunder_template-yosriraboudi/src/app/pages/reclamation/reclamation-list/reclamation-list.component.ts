import { Component } from '@angular/core';
import { Reclamation, StatutReclam, NiveauUrgence, CategorieReclamation } from '../../../core/models/reclamation';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html',
  styleUrls: ['./reclamation-list.component.scss']
})
export class ReclamationListComponent {
  reclamations: Reclamation[] = [];
  selectedDescription = '';
  reclamationToDelete: number | null = null;
  statusOptions = Object.values(StatutReclam);
  selectedStatus: string = '';
  currentReclamationId: number | null = null;

  filterForm: FormGroup;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 3;

  constructor(
    private reclamationService: ReclamationService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.filterForm = this.fb.group({
      statutReclam: [''],
      niveauUrgence: [''],
      categorie: [''],
      searchTerm: ['']
    });

    this.filterForm.valueChanges.subscribe(() => this.onFilter());
  }

  ngOnInit(): void {
    this.onFilter();
  }

  onFilter(): void {
    const { statutReclam, niveauUrgence, categorie, searchTerm } = this.filterForm.value;
     // À remplacer si nécessaire

    this.reclamationService.getFilteredReclamations(
      statutReclam,
      niveauUrgence,
      categorie,

      searchTerm,
      this.currentPage,
      this.pageSize,
      'DESC'
    ).subscribe({
      next: (response) => {
        this.reclamations = response.content;
        this.totalPages = response.totalPages;
      },
      error: (err) => console.error('Erreur chargement réclamations filtrées :', err)
    });
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.onFilter();
    }
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  openDescriptionModal(description: string) {
    this.selectedDescription = description;
    const modal = document.getElementById('descriptionModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  handleDelete(reclamationId: number, deleteModal: any): void {
    this.reclamationToDelete = reclamationId;
    this.modalService.open(deleteModal);
  }

  confirmDelete(): void {
    if (this.reclamationToDelete) {
      this.reclamationService.deleteReclamation(this.reclamationToDelete).subscribe({
        next: () => {
          this.onFilter();
          this.modalService.dismissAll();
        },
        error: (err) => console.error('Erreur:', err)
      });
    }
  }

  openStatusModal(reclamation: any, modalContent: any): void {
    this.currentReclamationId = reclamation.id;
    this.selectedStatus = reclamation.statutReclam;
    this.modalService.open(modalContent);
  }

  updateStatus(): void {
    if (this.currentReclamationId && this.selectedStatus) {
      this.reclamationService.updateReclamationStatus(this.currentReclamationId, this.selectedStatus).subscribe({
        next: () => {
          this.onFilter();
          this.modalService.dismissAll();
        },
        error: (err) => console.error('Erreur mise à jour:', err)
      });
    }
  }
}
