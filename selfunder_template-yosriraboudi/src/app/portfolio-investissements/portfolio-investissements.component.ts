import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvestissementService } from '../services/investissement.service';
import { Investissement, StatutInvestissement } from '../models/investissement';

@Component({
  selector: 'app-portfolio-investissements',
  standalone: false,
  templateUrl: './portfolio-investissements.component.html',
  styleUrls: ['./portfolio-investissements.component.scss']
})
export class PortfolioInvestissementsComponent implements OnInit {
  investissements: Investissement[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  portfolioId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private investissementService: InvestissementService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.portfolioId = +id;
        this.fetchInvestissements();
      } else {
        this.errorMessage = 'No portfolio ID provided.';
      }
    });
  }

  fetchInvestissements(): void {
    if (this.portfolioId !== null) {
      this.isLoading = true;
      this.investissementService.getInvestissementsByPortfolio(this.portfolioId).subscribe({
        next: (data) => {
          this.investissements = data;
          this.isLoading = false;
          if (data.length === 0) {
            this.errorMessage = 'Aucun investissement trouvé pour ce portfolio.';
          } else {
            this.errorMessage = null;
          }
        },
        error: (err) => {
          console.error('Error fetching investments:', err);
          this.errorMessage = 'Failed to load investments.';
          this.isLoading = false;
        }
      });
    }
  }

  approveInvestment(id: number): void {
    this.investissementService.approveInvestment(id).subscribe({
      next: () => {
        const inv = this.investissements.find(i => i.idInvestissement === id);
        if (inv) {
          inv.statutInvestissement = StatutInvestissement.APPROVED;
        }
        this.fetchInvestissements();
      },
      error: (err) => {
        this.errorMessage = 'Failed to approve investment.';
      }
    });
  }

  rejectInvestment(id: number): void {
    this.investissementService.rejectInvestment(id).subscribe({
      next: () => {
        const inv = this.investissements.find(i => i.idInvestissement === id);
        if (inv) {
          inv.statutInvestissement = StatutInvestissement.REJECTED;
        }
        this.fetchInvestissements();
      },
      error: (err) => {
        this.errorMessage = 'Failed to reject investment.';
      }
    });
  }
}