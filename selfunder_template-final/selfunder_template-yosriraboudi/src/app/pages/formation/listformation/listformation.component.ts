import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Formation, FormationService, TypeFormation, StatutFormation } from '../../../core/services/formation.service';
import { ChartConfiguration, ChartData } from 'chart.js';


@Component({
  selector: 'app-listformation',
  standalone: false,
  templateUrl: './listformation.component.html',
  styleUrl: './listformation.component.scss'
})
export class ListformationComponent implements OnInit {
  formations: Formation[] = [];
  formationsFiltered: Formation[] = []; // Pour conserver les formations filtrées
  loading: boolean = false;
  error: string | null = null;

  // Variables pour le tri
  sortField: string = 'titre'; // Champ de tri par défaut
  sortOrder: 'asc' | 'desc' = 'asc'; // Ordre de tri par défaut

  // Stats variables
  showStats: boolean = false;
  loadingStats: boolean = false;
  statsError: string | null = null;

  // Chart configuration for type
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#4e73df', '#e74a3b', '#1cc88a'],
      hoverBackgroundColor: ['#2e59d9', '#e02d1b', '#17a673'],
      hoverBorderColor: 'rgba(234, 236, 244, 1)',
    }],
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Répartition des formations par type'
      }
    }
  };

  // Chart configuration for status
  pieChartDataStatus: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#f6c23e', '#36b9cc'],
      hoverBackgroundColor: ['#e0af2a', '#2c9faf'],
      hoverBorderColor: 'rgba(234, 236, 244, 1)',
    }],
  };

  pieChartOptionsStatus: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Répartition des formations par statut'
      }
    }
  };

  // Chart configuration for certification
  pieChartDataCertification: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#1cc88a', '#858796'],
      hoverBackgroundColor: ['#17a673', '#6e707e'],
      hoverBorderColor: 'rgba(234, 236, 244, 1)',
    }],
  };

  pieChartOptionsCertification: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Répartition des formations par certification'
      }
    }
  };

  constructor(private formationService: FormationService) {}


  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.loading = true;
    this.error = null;

    this.formationService.getAllFormations().subscribe({
      next: (data) => {
        this.formations = data;
        this.formationsFiltered = [...data]; // Copie des formations pour le filtre/tri
        this.sortFormations(); // Tri initial
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des formations', err);
        this.error = 'Impossible de charger les formations. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  deleteFormation(id: number | undefined): void {
    if (id === undefined || id === null) {
      alert('ID de formation invalide');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      this.formationService.deleteFormation(id).subscribe({
        next: () => {
          this.formations = this.formations.filter(f => f.idFormation !== id);
          alert('Formation supprimée avec succès');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de la formation', err);
          alert('Erreur lors de la suppression de la formation');
        }
      });
    }
  }

  toggleStats(): void {
    this.showStats = !this.showStats;
    if (this.showStats) {
      if (this.pieChartData.labels?.length === 0) {
        this.loadStats();
      }
      if (this.pieChartDataStatus.labels?.length === 0) {
        this.loadStatsStatus();
      }
      if (this.pieChartDataCertification.labels?.length === 0) {
        this.loadStatsCertification();
      }
    }
  }

  loadStats(): void {
    this.loadingStats = true;
    this.statsError = null;

    this.formationService.getCountByType().subscribe({
      next: (data) => {
        // Reset chart data
        const labels: string[] = [];
        const values: number[] = [];

        // Process the data
        Object.entries(data).forEach(([type, count]) => {
          labels.push(type);
          values.push(count);
        });

        // Update chart
        this.pieChartData = {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ['#4e73df', '#e74a3b', '#1cc88a'],
            hoverBackgroundColor: ['#2e59d9', '#e02d1b', '#17a673'],
            hoverBorderColor: 'rgba(234, 236, 244, 1)',
          }],
        };

        this.loadingStats = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques par type', err);
        this.statsError = 'Impossible de charger les statistiques par type. Veuillez réessayer plus tard.';
        this.loadingStats = false;
      }
    });
  }

  loadStatsStatus(): void {
    this.loadingStats = true;
    this.statsError = null;

    this.formationService.getCountByStatut().subscribe({
      next: (data) => {
        // Reset chart data
        const labels: string[] = [];
        const values: number[] = [];

        // Process the data
        Object.entries(data).forEach(([statut, count]) => {
          labels.push(statut);
          values.push(count);
        });

        // Update chart
        this.pieChartDataStatus = {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ['#f6c23e', '#36b9cc'],
            hoverBackgroundColor: ['#e0af2a', '#2c9faf'],
            hoverBorderColor: 'rgba(234, 236, 244, 1)',
          }],
        };

        this.loadingStats = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques par statut', err);
        this.statsError = 'Impossible de charger les statistiques par statut. Veuillez réessayer plus tard.';
        this.loadingStats = false;
      }
    });
  }

  loadStatsCertification(): void {
    this.loadingStats = true;
    this.statsError = null;

    this.formationService.getCountByCertification().subscribe({
      next: (data) => {
        // Reset chart data
        const labels: string[] = [];
        const values: number[] = [];

        // Process the data
        Object.entries(data).forEach(([certif, count]) => {
          // Convertir le booléen en texte plus lisible
          const label = certif === 'true' ? 'Certifiée' : 'Non certifiée';
          labels.push(label);
          values.push(count);
        });

        // Update chart
        this.pieChartDataCertification = {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ['#1cc88a', '#858796'],
            hoverBackgroundColor: ['#17a673', '#6e707e'],
            hoverBorderColor: 'rgba(234, 236, 244, 1)',
          }],
        };

        this.loadingStats = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques par certification', err);
        this.statsError = 'Impossible de charger les statistiques par certification. Veuillez réessayer plus tard.';
        this.loadingStats = false;
      }
    });
  }

  // Définition du champ et de l'ordre de tri
  setSortField(field: string): void {
    if (this.sortField === field) {
      // Si on clique sur le même champ, on inverse l'ordre
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Sinon, on change de champ et on réinitialise l'ordre
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.sortFormations();
  }

  // Tri des formations selon le champ et l'ordre sélectionnés
  sortFormations(): void {
    if (!this.formationsFiltered) return;

    this.formationsFiltered.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      // Extraction des valeurs à comparer selon le champ de tri
      switch (this.sortField) {
        case 'titre':
          valueA = a.titre || '';
          valueB = b.titre || '';
          break;
        case 'prix':
          valueA = a.prix || 0;
          valueB = b.prix || 0;
          break;
        case 'duree':
          valueA = a.duree || 0;
          valueB = b.duree || 0;
          break;
        case 'typeFormation':
          valueA = a.typeFormation || '';
          valueB = b.typeFormation || '';
          break;
        default:
          valueA = a.titre || '';
          valueB = b.titre || '';
      }

      // Comparaison des valeurs selon l'ordre de tri
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return this.sortOrder === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }
    });
  }
}
