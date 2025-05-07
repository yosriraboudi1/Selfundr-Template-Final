import { Component, OnInit } from '@angular/core';
import { Reclamation } from '../../../core/models/reclamation'; // Assurez-vous que le chemin est correct
import { ReclamationService } from '../../../core/services/reclamation.service'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-reclamation-list-byuser',
  templateUrl: './reclamation-list-byuser.component.html',
  styleUrls: ['./reclamation-list-byuser.component.scss']
})
export class ReclamationListByuserComponent implements OnInit {
  reclamations: Reclamation[] = [];
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 3;
  selectedDescription = '';
  isSidebarOpen = false;

  // Propriété pour stocker les réclamations

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    const userId = 1; // Remplacez par l'ID de l'utilisateur actuel
    this.loadReclamationsByUser(userId);
  }
  openSidebar(description: string): void {
    this.selectedDescription = description;
    this.isSidebarOpen = true;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  loadReclamationsByUser(userId: number): void {
    this.reclamationService.getReclamationsByUser(userId, this.currentPage, this.pageSize).subscribe({
      next: (data: { content: Reclamation[], totalPages: number }) => {
        this.reclamations = data.content; // Les réclamations pour la page actuelle
        this.totalPages = data.totalPages; // Nombre total de pages
        console.log('Réclamations de l\'utilisateur chargées :', this.reclamations);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réclamations de l\'utilisateur :', err);
      }
    });
  }
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      const userId = 1; // Remplacez par l'ID de l'utilisateur actuel
      this.loadReclamationsByUser(userId); // Rechargez les données pour la nouvelle page
    }
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

}
