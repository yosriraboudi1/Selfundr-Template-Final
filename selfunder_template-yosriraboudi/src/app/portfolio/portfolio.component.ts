import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../services/portfolio.service';
import { InvestissementService } from '../services/investissement.service';
import { Portfolio, StatutProjet } from '../models/portfolio';
import { Investissement } from '../models/investissement';
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

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private portfolioService: PortfolioService,
    private investissementService: InvestissementService,
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
          // Convertir les clés de string en number
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
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.portfolioForm.reset({
        titreProjet: '',
        descriptionProjet: '',
        montantRecherche: 0,
        montantCollecte: 0,
        rendementPrevisionnel: 0,
        statutProjet: StatutProjet.En_Cours
      });
    }
  }

  onSubmit(): void {
    if (this.portfolioForm.valid) {
      const portfolio: Portfolio = {
        ...this.portfolioForm.value,
        userId: this.userId
      };
      this.portfolioService.createPortfolio(this.userId, portfolio).subscribe({
        next: (newPortfolio) => {
          this.portfolioForm.reset({
            titreProjet: '',
            descriptionProjet: '',
            montantRecherche: 0,
            montantCollecte: 0,
            rendementPrevisionnel: 0,
            statutProjet: StatutProjet.En_Cours
          });
          this.showForm = false;
          this.errorMessage = null;
          this.loadPortfolios();
          this.loadInvestmentCounts(); // Refresh counts after creating a new portfolio
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error creating portfolio:', {
            status: err.status,
            statusText: err.statusText,
            message: err.message,
            error: err.error
          });
          this.errorMessage = 'Failed to create portfolio. Please try again.';
        }
      });
    }
  }

  deletePortfolio(id: number | undefined): void {
    if (id !== undefined && confirm('Are you sure you want to delete this portfolio?')) {
      this.portfolioService.deletePortfolio(id).subscribe({
        next: () => {
          this.portfolios = this.portfolios.filter(p => p.idPortfolio !== id);
          this.errorMessage = this.portfolios.length === 0 ? 'No portfolios found.' : null;
          this.loadInvestmentCounts(); // Refresh counts after deletion
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
    const maxVisiblePages = 5; // Nombre maximum de pages visibles dans la pagination
    
    if (this.totalPages <= maxVisiblePages) {
      // Si le nombre total de pages est inférieur au maximum, afficher toutes les pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sinon, afficher un sous-ensemble de pages autour de la page courante
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

    // Calculer la progression moyenne
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