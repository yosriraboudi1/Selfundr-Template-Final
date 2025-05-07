// src/app/components/reclamation-stats/reclamation-stats.component.ts
import { Component, OnInit } from '@angular/core';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-reclamation-stats',
  templateUrl: './reclamation-stats.component.html',
  styleUrls: ['./reclamation-stats.component.scss']
})
export class ReclamationStatsComponent implements OnInit {
  stats: any;
  errorMessage: string | null = null;
  categoryChart: ChartConfiguration<'pie'> = {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    }
  };

  statusChart: ChartConfiguration<'pie'> = {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    }
  };

  urgencyChart: ChartConfiguration<'pie'> = {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    }
  };


  constructor(private reclamationService: ReclamationService) { }

  ngOnInit(): void {
    this.loadStats();
  }
  loadStats(): void {
    this.errorMessage = null;

    this.reclamationService.getStats().subscribe({
      next: (data) => {
        this.stats = data;

        this.categoryChart.data.labels = Object.keys(data.statsByCategory);
this.categoryChart.data.datasets[0].data = Object.values(data.statsByCategory);

this.statusChart.data.labels = Object.keys(data.statsByStatus);
this.statusChart.data.datasets[0].data = Object.values(data.statsByStatus);

this.urgencyChart.data.labels = Object.keys(data.statsByUrgency);
this.urgencyChart.data.datasets[0].data = Object.values(data.statsByUrgency);

      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des statistiques';
        console.error(err);
      }
    });
  }

  // loadStats(): void {
  //   this.errorMessage = null;

  //   this.reclamationService.getStats().subscribe({
  //     next: (data) => {
  //       console.log("data",data);

  //       this.stats = data;

  //     },
  //     error: (err) => {
  //       this.errorMessage = 'Erreur lors du chargement des statistiques';
  //       console.error(err);
  //     }
  //   });
  // }

}
