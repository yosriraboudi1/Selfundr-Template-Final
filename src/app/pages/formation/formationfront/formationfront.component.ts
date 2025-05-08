import { Component, OnInit } from '@angular/core';
import { Formation, FormationService, StatutFormation, TypeFormation } from '../../../core/services/formation.service';

@Component({
  selector: 'app-formationfront',
  standalone: false,
  templateUrl: './formationfront.component.html',
  styleUrls: ['./formationfront.component.scss']
})
export class FormationfrontComponent implements OnInit {
  formations: Formation[] = [];
  filteredFormations: Formation[] = [];
  selectedType: TypeFormation | 'ALL' | 'TOP_RATED' = 'ALL';
  searchTerm: string = '';
  selectedFormation: Formation | null = null;
  userRating: number = 0;
  ratingSubmitted: boolean = false;
  ratingError: string = '';
  topRatedFormation: Formation | null = null;
  
  // Variables pour la pagination
  currentPage: number = 1;
  pageSize: number = 6; // Nombre de formations par page
  totalItems: number = 0;
  paginatedFormations: Formation[] = [];

  constructor(private formationService: FormationService) {}

  ngOnInit(): void {
    this.loadFormations();
    this.loadTopRatedFormation();
  }

  loadFormations(): void {
    this.formationService.getAllFormations().subscribe({
      next: (data) => {
        this.formations = data;
        this.filteredFormations = [...this.formations];
        this.updatePagination();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des formations:', error);
        // Utiliser des données statiques en cas d'erreur
        this.loadStaticData();
      }
    });
  }

  loadTopRatedFormation(): void {
    this.formationService.getFormationAvecMeilleureNote().subscribe({
      next: (formation) => {
        this.topRatedFormation = formation;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la formation la mieux notée:', error);
      }
    });
  }

  private loadStaticData(): void {
    // Données statiques de secours
    this.formations = [
      {
        titre: 'Introduction to Angular',
        description: 'Learn the basics of Angular framework',
        duree: 20,
        prix: 99.99,
        certificat: true,
        noteMoyenne: 4.5,
        notesUsers: [4, 5, 4, 5, 4],
        typeFormation: TypeFormation.WEBINAIR,
        statutFormation: StatutFormation.En_Cours
      },
      {
        titre: 'Advanced TypeScript',
        description: 'Master TypeScript programming',
        duree: 15,
        prix: 149.99,
        certificat: true,
        noteMoyenne: 4.8,
        notesUsers: [5, 5, 4, 5, 5],
        typeFormation: TypeFormation.VIDEO,
        statutFormation: StatutFormation.Complète
      }
    ];
    this.filteredFormations = [...this.formations];
    this.updatePagination();
  }

  filterByType(type: TypeFormation | 'ALL' | 'TOP_RATED' | string): void {
    // Handle string type coming from template
    this.selectedType = type as (TypeFormation | 'ALL' | 'TOP_RATED');
    this.applyFilters();
  }

  searchFormations(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.applyFilters();
  }

  private applyFilters(): void {
    if (this.selectedType === 'TOP_RATED' && this.topRatedFormation) {
      // Si filtre "meilleures notes" est sélectionné, n'afficher que la formation avec la meilleure note
      this.filteredFormations = [this.topRatedFormation];
    } else {
      // Sinon appliquer les filtres habituels
      this.filteredFormations = this.formations.filter(formation => {
        const matchesType = this.selectedType === 'ALL' || formation.typeFormation === this.selectedType;
        const matchesSearch = formation.titre?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            formation.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
        return matchesType && matchesSearch;
      });
    }
    
    // Après avoir filtré, mettre à jour la pagination
    this.currentPage = 1; // Retour à la première page après filtrage
    this.updatePagination();
  }
  
  // Méthode pour mettre à jour les données paginées
  updatePagination(): void {
    this.totalItems = this.filteredFormations.length;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalItems);
    this.paginatedFormations = this.filteredFormations.slice(startIndex, endIndex);
  }
  
  // Méthodes pour la navigation dans la pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePagination();
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePagination();
    }
  }
  
  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
  
  // Crée un tableau avec les numéros de page pour l'affichage
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const visiblePages = 5; // Nombre de pages visibles dans la pagination
    
    let startPage = Math.max(1, this.currentPage - Math.floor(visiblePages / 2));
    let endPage = startPage + visiblePages - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - visiblePages + 1);
    }
    
    return Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);
  }

  // Méthode pour calculer le dernier élément affiché sur la page courante
  getCurrentPageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  // Méthode pour ouvrir le modal de détails
  openFormationDetails(formation: Formation): void {
    this.selectedFormation = formation;
    this.userRating = 0;
    this.ratingSubmitted = false;
    this.ratingError = '';
    // Utiliser Bootstrap JavaScript pour ouvrir le modal
    // Cette partie nécessite que bootstrap.js soit chargé
  }

  // Méthode pour définir la note de l'utilisateur
  setUserRating(rating: number): void {
    this.userRating = rating;
  }

  // Méthode pour soumettre une note
  soumettreNote(): void {
    if (!this.selectedFormation || !this.selectedFormation.idFormation) {
      this.ratingError = 'Formation non valide';
      return;
    }

    if (this.userRating < 1 || this.userRating > 5) {
      this.ratingError = 'La note doit être comprise entre 1 et 5';
      return;
    }

    this.formationService.soumettreNote(this.selectedFormation.idFormation, this.userRating).subscribe({
      next: (response) => {
        this.ratingSubmitted = true;
        this.ratingError = '';
        
        // Mettre à jour les formations pour afficher la nouvelle note moyenne
        this.loadFormations();
        this.loadTopRatedFormation(); // Aussi recharger la formation la mieux notée
      },
      error: (error) => {
        console.error('Erreur lors de la soumission de la note:', error);
        this.ratingError = error.message || 'Erreur lors de la soumission de la note';
      }
    });
  }
}