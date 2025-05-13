import { Component, OnInit } from '@angular/core';
import {InvestissementService} from "../Service/investissement.service";
import {PortfolioPerformanceService} from "../Service/portfolio-performance.service";
 import {PortfolioService} from "../Service/portfolio.service";
import { Portfolio, StatutProjet } from '../models/portfolio';
import { Investissement } from '../models/investissement';
import { PortfolioPerformance } from '../models/portfolio-performance.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  portfolios: Portfolio[] = [];
  portfolioForm: FormGroup;
  showForm = false;
  isEditing = false;
  editingPortfolioId: number | null = null;
  userId = 1; // Replace with actual user ID (e.g., from auth service)
  statutProjetEnum = StatutProjet;
  errorMessage: string | null = null;
  selectedPortfolioInvestments: Investissement[] = [];
  showInvestmentsModal = false;
  investmentsErrorMessage: string | null = null;
  selectedPortfolioId: number | null = null;
  isLoading = false;
  investmentCounts: { [key: number]: number } = {};
  showProgressStats = false;
  portfolioProgress = {
    totalPortfolios: 0,
    completedPortfolios: 0,
    inProgressPortfolios: 0,
    averageProgress: 0
  };
  portfolioPerformances: { [key: number]: PortfolioPerformance } = {};

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private portfolioService: PortfolioService,
    private investissementService: InvestissementService,
    private portfolioPerformanceService: PortfolioPerformanceService,
    private fb: FormBuilder
  ) {
    this.portfolioForm = this.fb.group({
      titreProjet: ['', Validators.required],
      descriptionProjet: ['', Validators.required],
      montantRecherche: [0, [Validators.required, Validators.min(0)]],
      montantCollecte: [0, [Validators.required, Validators.min(0)]],
      rendementPrevisionnel: [0, [Validators.required, Validators.min(0)]],
      statutProjet: [StatutProjet.En_Cours, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPortfolios();
    this.loadInvestmentCounts();
  }

  loadPortfolios(): void {
    this.errorMessage = null;
    this.portfolioService.getAllPortfolios().subscribe({
      next: (portfolios) => {
        this.portfolios = portfolios;
        this.totalItems = portfolios.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        if (this.currentPage > this.totalPages) {
          this.currentPage = 1;
        }
        console.log('Loaded portfolios:', portfolios);
        this.errorMessage = portfolios.length === 0 ? 'No portfolios found.' : null;
        this.loadPortfolioPerformances();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading portfolios:', err);
        this.errorMessage = this.getErrorMessage(err);
      }
    });
  }

  loadInvestmentCounts(): void {
    this.investissementService.getInvestmentCountsByPortfolio().subscribe({
      next: (counts) => {
        if (counts) {
          this.investmentCounts = Object.keys(counts).reduce((acc, key) => {
            acc[Number(key)] = counts[Number(key)];
            return acc;
          }, {} as { [key: number]: number });
        } else {
          this.investmentCounts = {};
        }
        console.log('Investment counts:', this.investmentCounts);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading investment counts:', err);
        this.investmentCounts = {};
      }
    });
  }

  loadPortfolioPerformances(): void {
    this.portfolioPerformances = {};
    this.portfolios.forEach((portfolio) => {
      if (portfolio.idPortfolio) {
        const progressPercentage = portfolio.montantRecherche > 0
          ? Math.min((portfolio.montantCollecte / portfolio.montantRecherche) * 100, 100)
          : 0;
        const currentValue = portfolio.montantCollecte;
        const rendementPrevisionnel = portfolio.rendementPrevisionnel || 0;
        const forecasts = {
          '1': currentValue * (1 + rendementPrevisionnel / 100),
          '2': currentValue * Math.pow(1 + rendementPrevisionnel / 100, 2),
          '3': currentValue * Math.pow(1 + rendementPrevisionnel / 100, 3)
        };

        this.portfolioPerformances[portfolio.idPortfolio!] = {
          portfolioId: portfolio.idPortfolio!,
          titreProjet: portfolio.titreProjet || '',
          montantCollecte: portfolio.montantCollecte,
          montantRecherche: portfolio.montantRecherche,
          progressPercentage,
          currentValue,
          rendementPrevisionnel,
          forecasts,
          error: null
        };
      }
    });
  }

  retryLoadPortfolios(): void {
    this.loadPortfolios();
  }

  getErrorMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Unable to connect to the server. Please check if the backend is running.';
    } else if (err.status >= 500) {
      return 'Server error occurred. Please try again later or contact support.';
    } else if (err.status === 404) {
      return 'Portfolio endpoint not found. Please verify the backend API.';
    } else if (err.status === 403 || err.status === 401) {
      return 'Access denied. Please check CORS or authentication settings.';
    }
    return 'Failed to load portfolios. Please try again.';
  }

  toggleForm(): void {
    if (this.showForm) {
      this.resetForm();
    } else {
      this.showForm = true;
      this.isEditing = false;
      this.editingPortfolioId = null;
    }
  }

  editPortfolio(portfolio: Portfolio): void {
    this.isEditing = true;
    this.editingPortfolioId = portfolio.idPortfolio || null;
    this.showForm = true;

    this.portfolioForm.patchValue({
      titreProjet: portfolio.titreProjet,
      descriptionProjet: portfolio.descriptionProjet,
      montantRecherche: portfolio.montantRecherche,
      montantCollecte: portfolio.montantCollecte,
      rendementPrevisionnel: portfolio.rendementPrevisionnel,
      statutProjet: portfolio.statutProjet
    });
  }

  onSubmit(): void {
    if (this.portfolioForm.valid) {
      const portfolioData: Portfolio = {
        ...this.portfolioForm.value,
        userId: this.userId
      };

      if (this.isEditing && this.editingPortfolioId) {
        this.portfolioService.updatePortfolio(this.editingPortfolioId, portfolioData).subscribe({
          next: (updatedPortfolio) => {
            this.portfolios = this.portfolios.map(p =>
              p.idPortfolio === this.editingPortfolioId ? updatedPortfolio : p
            );
            this.resetForm();
            this.errorMessage = null;
            this.loadPortfolioPerformances();
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error updating portfolio:', err);
            this.errorMessage = 'Failed to update portfolio. Please try again.';
          }
        });
      } else {
        this.portfolioService.createPortfolio(this.userId, portfolioData).subscribe({
          next: (newPortfolio) => {
            this.portfolios = [...this.portfolios, newPortfolio];
            this.resetForm();
            this.errorMessage = null;
            this.loadPortfolioPerformances();
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error creating portfolio:', err);
            this.errorMessage = 'Failed to create portfolio. Please try again.';
          }
        });
      }
    }
  }

  resetForm(): void {
    this.portfolioForm.reset({
      titreProjet: '',
      descriptionProjet: '',
      montantRecherche: 0,
      montantCollecte: 0,
      rendementPrevisionnel: 0,
      statutProjet: StatutProjet.En_Cours
    });
    this.showForm = false;
    this.isEditing = false;
    this.editingPortfolioId = null;
  }

  deletePortfolio(id: number | undefined): void {
    if (id !== undefined && confirm('Are you sure you want to delete this portfolio?')) {
      this.portfolioService.deletePortfolio(id).subscribe({
        next: () => {
          this.portfolios = this.portfolios.filter(p => p.idPortfolio !== id);
          this.errorMessage = this.portfolios.length === 0 ? 'No portfolios found.' : null;
          this.loadInvestmentCounts();
          this.loadPortfolioPerformances();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error deleting portfolio:', {
            status: err.status,
            statusText: err.statusText,
            message: err.message,
            error: err.error
          });
          this.errorMessage = 'Failed to delete portfolio. Please try again.';
        }
      });
    }
  }

  viewInvestments(portfolioId: number | undefined): void {
    if (portfolioId !== undefined) {
      console.log('Fetching investments for portfolio ID:', portfolioId);
      this.selectedPortfolioId = portfolioId;
      this.investmentsErrorMessage = null;
      this.selectedPortfolioInvestments = [];
      this.isLoading = true;
      this.showInvestmentsModal = true;
      this.investissementService.getInvestissementsByPortfolio(portfolioId).subscribe({
        next: (investments) => {
          this.isLoading = false;
          console.log('Investments received:', investments);
          this.selectedPortfolioInvestments = investments;
          console.log('Should show table:', investments.length > 0);
          this.investmentsErrorMessage = investments.length === 0 ? 'No investments found for this portfolio.' : null;
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          console.error('Error loading investments:', {
            status: err.status,
            statusText: err.statusText,
            message: err.message,
            error: err.error
          });
          this.investmentsErrorMessage = this.getInvestmentsErrorMessage(err);
        }
      });
    } else {
      console.error('Portfolio ID is undefined');
      this.investmentsErrorMessage = 'Invalid portfolio ID.';
      this.showInvestmentsModal = true;
      this.isLoading = false;
    }
  }

  retryFetchInvestments(): void {
    if (this.selectedPortfolioId !== null) {
      this.viewInvestments(this.selectedPortfolioId);
    } else {
      console.error('No portfolio ID selected for retry');
      this.investmentsErrorMessage = 'Cannot retry: No portfolio selected.';
      this.isLoading = false;
    }
  }

  closeInvestmentsModal(): void {
    this.showInvestmentsModal = false;
    this.selectedPortfolioInvestments = [];
    this.investmentsErrorMessage = null;
    this.selectedPortfolioId = null;
    this.isLoading = false;
  }

  getInvestmentsErrorMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Unable to connect to the server. Please check if the backend is running.';
    } else if (err.status >= 500) {
      return 'Server error occurred. Please try again later or contact support.';
    } else if (err.status === 404) {
      return 'Investments endpoint not found. Please verify the backend API.';
    } else if (err.status === 403 || err.status === 401) {
      return 'Access denied. Please check authentication settings.';
    }
    return 'Failed to load investments. Please try again.';
  }

  // Pagination methods
  get paginatedPortfolios(): Portfolio[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.portfolios.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get pages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;

      if (endPage > this.totalPages) {
        endPage = this.totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  calculatePortfolioProgress(): void {
    this.portfolioProgress.totalPortfolios = this.portfolios.length;
    this.portfolioProgress.completedPortfolios = this.portfolios.filter(p =>
      p.statutProjet === StatutProjet.Financé).length;
    this.portfolioProgress.inProgressPortfolios = this.portfolios.filter(p =>
      p.statutProjet === StatutProjet.En_Cours).length;

    const totalProgress = this.portfolios.reduce((sum, portfolio) => {
      if (portfolio.montantRecherche > 0) {
        return sum + (portfolio.montantCollecte / portfolio.montantRecherche) * 100;
      }
      return sum;
    }, 0);

    this.portfolioProgress.averageProgress = this.portfolioProgress.totalPortfolios > 0
      ? totalProgress / this.portfolioProgress.totalPortfolios
      : 0;
  }

  toggleProgressStats(): void {
    this.showProgressStats = !this.showProgressStats;
    if (this.showProgressStats) {
      this.calculatePortfolioProgress();
    }
  }
}
