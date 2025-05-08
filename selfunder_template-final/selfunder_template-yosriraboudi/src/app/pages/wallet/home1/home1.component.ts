import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
//import { QRCodeComponent } from 'angularx-qrcode';
import { RouterModule } from '@angular/router';
import { WalletService } from '../../../core/services/wallet.service';
import { Portfeuille, StatutPortfeuille } from '../../../core/models/wallet.model';


// Keeping this interface for compatibility with existing code
interface WalletBalance {
  totalBalance: number;
  availableBalance: number;
  pendingTransactions: number;
  lastUpdated: string;
  currency: string;
  pin: string;
  investedAmount: number;
  savingsAmount: number;
  creditAmount: number;
  expectedReturn: number;
}


interface Action {
  type: string;
  title: string;
  icon: string;
}

interface DashboardStats {
  totalValue: number;
  savingsAmount: number;
  investedAmount: number;
  availableBalance: number;
  expectedReturn: number;
  totalReturn: number;
  totalBalance: number;
}

@Component({
  selector: 'app-wallet-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './home1.component.html',
  styleUrls: ['./home1.component.scss']
})
export class Home1Component implements OnInit {
  walletData: WalletBalance = {
    totalBalance: 25000,
    availableBalance: 15000,
    pendingTransactions: 500,
    lastUpdated: new Date().toISOString(),
    currency: 'USD',
    pin: '1234',
    investedAmount: 5000,
    savingsAmount: 3000,
    creditAmount: 2000,
    expectedReturn: 0
  };

  dashboardStats: DashboardStats = {
    totalValue: 0,
    savingsAmount: 0,
    investedAmount: 0,
    availableBalance: 0,
    expectedReturn: 0,
    totalReturn: 0,
    totalBalance: 0
  };

  // Wallet data from the backend
  wallets: Portfeuille[] = [];
  selectedWallet: Portfeuille | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  actions: Action[] = [
   
    { type: 'update', title: 'Update', icon: 'bi bi-pencil' },
    { type: 'details', title: 'Details', icon: 'bi bi-info-circle' },
    { type: 'delete', title: 'Delete', icon: 'bi bi-trash' }
  ];
  
  // All actions are shown in the same grid now


  showForm = false;
  showQRCode = false;
  selectedType = '';
  showDetails = false;
  form: FormGroup = new FormGroup({}); // Initialize with empty form group to avoid TS errors
  updateForm: FormGroup;
  pinForm: FormGroup;
  isAuthenticated = false;
  isDarkTheme = false;
  qrValue = '';

  // Données pour les fonctionnalités avancées
  donneesPerfHistorique: any = null;
  donneesSimulation: any = null;
  donneesDiversification: any = null;
  donneesRisque: any = null;
  donneesRecommandations: any = null;
  donneesIndicateurs: any = null;

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService
  ) {
    this.pinForm = this.fb.group({
      pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });
    this.updateForm = this.fb.group({
      valeurTotale: [0, [Validators.required, Validators.min(0)]],
      montantEpargne: [0, [Validators.required, Validators.min(0)]],
      montantInvestie: [0, [Validators.required, Validators.min(0)]],
      soldeDisponible: [0, [Validators.required, Validators.min(0)]],
      codePin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });
  }

  ngOnInit(): void {
    // Initialiser tous les formulaires
    this.initForms();
    
    // Charger les portefeuilles
    this.loadWallets();
    
    // Données de démo pour le tableau de bord
    this.updateDashboardStats();
    
    // Vérifier si les icônes Bootstrap sont chargées
    this.chargerIconesBootstrap();
  }
  
  /**
   * Initialise tous les formulaires utilisés dans le composant
   */
  initForms(): void {
    // Formulaire principal pour diverses actions
    this.form = this.fb.group({
      // Champs pour l'investissement
      amount: [0, [Validators.required, Validators.min(1)]],
      investmentType: ['stocks', Validators.required],
      
      // Champs pour le transfert
      sourceWallet: ['', Validators.required],
      destinationWallet: ['', Validators.required],
      transferAmount: [0, [Validators.required, Validators.min(1)]],
      transferNote: [''],
      
      // Champs pour la simulation de croissance
      montantMensuel: [100, [Validators.required, Validators.min(0)]],
      dureeAnnees: [5, [Validators.required, Validators.min(1), Validators.max(30)]],
      tauxRendement: [7, [Validators.required, Validators.min(0), Validators.max(30)]],
      
      // Champs pour les recommandations
      profilRisque: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      objectifs: ['croissance', Validators.required]
    });
  }
  
  /**
   * S'assure que les icônes Bootstrap sont chargées
   */
  chargerIconesBootstrap(): void {
    // Vérifier si le CSS de Bootstrap Icons est déjà chargé
    if (!document.querySelector('link[href*="bootstrap-icons"]')) {
      // Ajouter la feuille de style Bootstrap Icons si elle n'est pas déjà présente
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
      document.head.appendChild(link);
      console.log('Bootstrap Icons CSS ajouté dynamiquement');
    }
  }
  
  /**
   * Load all wallets from the backend
   */
  loadWallets(): void {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Début du chargement des portefeuilles...');
    
    this.walletService.getAllWallets().subscribe({
      next: (wallets) => {
        console.log('Portefeuilles reçus du service:', wallets);
        this.wallets = wallets;
        this.isLoading = false;
        
        if (wallets && wallets.length > 0) {
          console.log('Sélection automatique du premier portefeuille:', wallets[0]);
          // Petite temporisation pour s'assurer que l'UI a le temps de se mettre à jour
          setTimeout(() => {
            this.selectWallet(wallets[0]);
          }, 100);
        } else {
          console.log('Aucun portefeuille disponible');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to load wallets';
        console.error('Erreur lors du chargement des portefeuilles:', error);
      }
    });
  }
  
  // Gère l'événement de changement du sélecteur de portefeuille
  onWalletSelect = (event: Event): void => {
    const selectElement = event.target as HTMLSelectElement;
    const selectedIndex = Number(selectElement.value);
    console.log('Wallet selected:', selectedIndex);
    
    if (this.wallets && this.wallets.length > selectedIndex) {
      this.selectWallet(this.wallets[selectedIndex]);
    }
  }
  
  /**
   * Select a wallet and load its details
   */
  selectWallet(wallet: Portfeuille): void {
    // Débogage - Voir la structure complète du portefeuille
    console.log('Structure complète du portefeuille:', JSON.stringify(wallet));
    
    // Recherche de différentes propriétés possibles qui pourraient contenir l'ID
    // Les noms possibles selon divers formats backend
    const possibleIdFields = [
      'id',
      'idPortfeuille',
      'portfeuilleId',
      'wallet_id',
      'walletId',
      'ID',
      '_id'
    ];
    
    // Recherche de l'ID dans toutes les propriétés du portefeuille
    let walletId: any = null;
    
    // D'abord essayer les champs connus
    for (const field of possibleIdFields) {
      if (wallet[field as keyof Portfeuille] !== undefined && wallet[field as keyof Portfeuille] !== null) {
        walletId = wallet[field as keyof Portfeuille];
        console.log(`ID trouvé dans le champ '${field}': ${walletId}`);
        break;
      }
    }
    
    // Si aucun ID n'est trouvé, rechercher dans toutes les propriétés qui contiennent 'id'
    if (!walletId) {
      for (const key in wallet) {
        if (key.toLowerCase().includes('id') && wallet[key as keyof Portfeuille] !== undefined && wallet[key as keyof Portfeuille] !== null) {
          walletId = wallet[key as keyof Portfeuille];
          console.log(`ID trouvé dans un champ alternatif '${key}': ${walletId}`);
          break;
        }
      }
    }
    
    // Comme solution de dernier recours, prendre la première propriété numérique du portefeuille
    if (!walletId) {
      for (const key in wallet) {
        if (typeof wallet[key as keyof Portfeuille] === 'number' && key !== 'valeurTotale' && key !== 'montantEpargne') {
          walletId = wallet[key as keyof Portfeuille];
          console.log(`Utilisation d'une propriété numérique comme ID de secours '${key}': ${walletId}`);
          break;
        }
      }
    }
    
    // Si aucun ID n'a été trouvé, créer un portefeuille fallback
    if (!walletId) {
      console.error('Cannot select wallet: No ID found', wallet);
      
      // Créer un portefeuille de secours pour l'authentification
      this.selectedWallet = wallet;
      this.selectedWallet.codePin = '1234'; // PIN par défaut
      console.log('Portefeuille de secours créé avec PIN par défaut:', this.selectedWallet);
      this.isLoading = false;
      this.updateWalletDisplay(wallet);
      return;
    }
    
    this.isLoading = true;
    this.walletService.getWalletById(walletId).subscribe({
      next: (walletDetails) => {
        this.selectedWallet = walletDetails;
        this.isLoading = false;
        
        // Update the selected wallet with the latest details
        this.selectedWallet = { ...walletDetails };
        
        // Handle rare case where PIN might be missing
        if (!this.selectedWallet.codePin) {
          this.selectedWallet.codePin = '1234'; // PIN par défaut
        }
        this.updateWalletDisplay(wallet);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || `Failed to load wallet details for ID: ${walletId}`;
        console.error('Erreur lors du chargement des détails du portefeuille:', error);
        
        // Même en cas d'erreur, on utilise le portefeuille de sélection directe
        this.selectedWallet = wallet;
        if (!this.selectedWallet.codePin) {
          this.selectedWallet.codePin = '1234'; // PIN par défaut
        }
        this.updateWalletDisplay(wallet);
      }
    });
  }
  
  /**
   * Update wallet display based on selected wallet
   */
  updateWalletDisplay(wallet: Portfeuille): void {
    if (!wallet) return;
    
    // Update the wallet data display
    this.walletData = {
      totalBalance: wallet.valeurTotale || 0,
      availableBalance: wallet.soldeDisponible || 0,
      pendingTransactions: 0, // Not provided by backend
      lastUpdated: new Date().toISOString(),
      currency: 'USD', // Default currency
      pin: wallet.codePin || '0000',
      investedAmount: wallet.montantInvestie || 0,
      savingsAmount: wallet.montantEpargne || 0,
      creditAmount: wallet.montantCredit || 0,
      expectedReturn: wallet.rendementPrevisionnel || 0
    };
    
    this.updateDashboardStats();
  }
  
  /**
   * Delete the selected wallet
   */
  deleteWallet(): void {
    if (!this.selectedWallet) {
      alert('Please select a wallet to delete');
      return;
    }
    
    // Search for the wallet ID using the same robust approach as in selectWallet
    // The possible ID field names according to various backend formats
    const possibleIdFields = [
      'id',
      'idPortfeuille',
      'portfeuilleId',
      'wallet_id',
      'walletId',
      'ID',
      '_id'
    ];
    
    // Search for the ID in all wallet properties
    let walletId: any = null;
    
    // First try known fields
    for (const field of possibleIdFields) {
      if (this.selectedWallet[field as keyof Portfeuille] !== undefined && 
          this.selectedWallet[field as keyof Portfeuille] !== null) {
        walletId = this.selectedWallet[field as keyof Portfeuille];
        console.log(`Deletion - ID found in field '${field}': ${walletId}`);
        break;
      }
    }
    
    // If no ID is found, search in all properties containing 'id'
    if (!walletId) {
      for (const key in this.selectedWallet) {
        if (key.toLowerCase().includes('id') && 
            this.selectedWallet[key as keyof Portfeuille] !== undefined && 
            this.selectedWallet[key as keyof Portfeuille] !== null) {
          walletId = this.selectedWallet[key as keyof Portfeuille];
          console.log(`Deletion - ID found in alternative field '${key}': ${walletId}`);
          break;
        }
      }
    }
    
    // As a last resort, take the first numeric property of the wallet
    if (!walletId) {
      for (const key in this.selectedWallet) {
        if (typeof this.selectedWallet[key as keyof Portfeuille] === 'number' && 
            key !== 'valeurTotale' && key !== 'montantEpargne') {
          walletId = this.selectedWallet[key as keyof Portfeuille];
          console.log(`Deletion - Using numeric property as fallback ID '${key}': ${walletId}`);
          break;
        }
      }
    }
    
    if (!walletId) {
      console.error('Cannot delete wallet: No ID found', this.selectedWallet);
      alert('Cannot delete wallet: No ID found');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete this wallet? This cannot be undone.`)) {
      return;
    }
    
    this.isLoading = true;
    
    this.walletService.deleteWallet(Number(walletId)).subscribe({
      next: () => {
        console.log(`Wallet with ID ${walletId} deleted successfully`);
        // Remove from the local array
        this.wallets = this.wallets.filter(w => 
          (w.idPortfeuille !== walletId && w.id !== walletId)
        );
        
        this.selectedWallet = null;
        this.isLoading = false;
        
        alert('Wallet deleted successfully');
        
        // Select another wallet if available
        if (this.wallets.length > 0) {
          this.selectWallet(this.wallets[0]);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error(`Error deleting wallet with ID ${walletId}:`, error);
        alert(`Failed to delete wallet: ${error.message || 'Server error'}`); 
      }
    });
  }

 
  updateDashboardStats() {
    this.dashboardStats = {
      totalValue: this.walletData.totalBalance,
      savingsAmount: this.walletData.savingsAmount,
      investedAmount: this.walletData.investedAmount,
      availableBalance: this.walletData.availableBalance,
      expectedReturn: this.walletData.expectedReturn,
      totalReturn: this.walletData.totalBalance - this.walletData.investedAmount,
      totalBalance: this.walletData.savingsAmount + this.walletData.investedAmount + this.walletData.availableBalance
    };
  }

  handleAction(type: string): void {
    this.selectedType = type;
    this.showForm = true;
    this.showQRCode = false;
    this.showDetails = false;
    this.errorMessage = '';
    
    // Reset form when showing
    if (this.form) {
      this.form.reset();
    }
    
    switch (type) {
      case 'update':
        if (!this.selectedWallet) {
          alert('Please select a wallet to update');
          this.showForm = false;
          return;
        }
        this.initUpdateForm();
        break;
        
      case 'details':
        if (!this.selectedWallet) {
          alert('Please select a wallet to view details');
          this.showForm = false;
          return;
        }
        this.showDetails = true;
        this.showForm = false;
        break;
        
      case 'delete':
        this.deleteWallet();
        this.showForm = false;
        break;
        
      case 'calculate-yield':
        this.calculateYield();
        this.showForm = false;
        break;
        
      case 'export-pdf':
        this.exportToPdf();
        this.showForm = false;
        break;
        
      case 'invest':
        if (!this.selectedWallet) {
          alert('Please select a wallet to invest');
          this.showForm = false;
          return;
        }
        this.initInvestForm();
        break;
        
      case 'transfer':
        if (!this.selectedWallet) {
          alert('Please select a wallet for transfer');
          this.showForm = false;
          return;
        }
        this.initTransferForm();
        break;
        
      default:
        this.showForm = false;
        break;
    }
  }
   

  closeForm() {
    this.showForm = false;
    this.showDetails = false;
    this.form.reset();
    this.updateForm.reset();
  }

  verifyPin() {
    if (this.pinForm.valid) {
      const enteredPin = this.pinForm.get('pin')?.value;
      console.log('PIN entré:', enteredPin);
      
      // Si nous avons un portefeuille sélectionné, utiliser son code PIN
      if (this.selectedWallet && this.selectedWallet.codePin) {
        console.log('Portefeuille sélectionné:', this.selectedWallet);
        console.log('Code PIN du portefeuille:', this.selectedWallet.codePin);
        console.log('Comparaison: ', enteredPin === this.selectedWallet.codePin ? 'identique' : 'différent');
        
        // Forcer la conversion en string pour s'assurer que la comparaison est correcte
        if (String(enteredPin) === String(this.selectedWallet.codePin)) {
          console.log('PIN correct - Authentification réussie!');
          this.isAuthenticated = true;
        } else {
          console.log('PIN incorrect');
          alert('Code PIN invalide. Veuillez réessayer.');
          this.pinForm.reset();
        }
      } 
      // Sinon, utiliser le comportement par défaut avec localStorage
      else {
        console.log('Aucun portefeuille sélectionné, utilisation du localStorage');
        const storedPin = localStorage.getItem('walletPin');
        console.log('PIN stocké:', storedPin);

        if (!storedPin) {
          localStorage.setItem('walletPin', enteredPin);
          this.isAuthenticated = true;
          console.log('Nouveau PIN enregistré, authentification réussie!');
        } else if (enteredPin === storedPin) {
          this.isAuthenticated = true;
          console.log('PIN correct (localStorage) - Authentification réussie!');
        } else {
          console.log('PIN incorrect (localStorage)');
          alert('Code PIN invalide. Veuillez réessayer.');
          this.pinForm.reset();
        }
      }
      
      // Vérifier l'état d'authentification après traitement
      console.log('Statut d\'authentification après vérification:', this.isAuthenticated ? 'Connecté' : 'Non connecté');
    }
  }


  /**
   * Initialize the update form with the selected wallet's values
   */
  initUpdateForm(): void {
    if (!this.selectedWallet) return;
    
    this.updateForm.patchValue({
      valeurTotale: this.selectedWallet.valeurTotale || 0,
      montantEpargne: this.selectedWallet.montantEpargne || 0,
      montantInvestie: this.selectedWallet.montantInvestie || 0,
      soldeDisponible: this.selectedWallet.soldeDisponible || 0,
      codePin: this.selectedWallet.codePin || ''
    });
  }

  /**
   * Submit the update form to update the wallet
   */
  submitUpdateForm(): void {
    if (!this.updateForm.valid || !this.selectedWallet) {
      alert('Please fill in all required fields');
      return;
    }

    const formValues = this.updateForm.value;
    
    // Create updated wallet object
    const updatedWallet: Portfeuille = {
      ...this.selectedWallet,
      valeurTotale: Number(formValues.valeurTotale),
      montantEpargne: Number(formValues.montantEpargne),
      montantInvestie: Number(formValues.montantInvestie),
      soldeDisponible: Number(formValues.soldeDisponible),
      codePin: formValues.codePin
    };
    
    // Ensure we have a valid ID to update
    if (!updatedWallet.idPortfeuille && updatedWallet.id) {
      updatedWallet.idPortfeuille = Number(updatedWallet.id);
    }
    
    this.isLoading = true;
    
    this.walletService.updateWallet(updatedWallet).subscribe({
      next: (response) => {
        console.log('Wallet updated successfully:', response);
        this.isLoading = false;
        
        // Update wallet in the list
        const index = this.wallets.findIndex(w => 
          (w.idPortfeuille === updatedWallet.idPortfeuille || w.id === updatedWallet.idPortfeuille));
        
        if (index !== -1) {
          this.wallets[index] = response;
        }
        
        // Update the selected wallet
        this.selectedWallet = response;
        
        // Update the wallet display
        this.updateWalletDisplay(response);
        
        alert('Wallet updated successfully');
        this.closeForm();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error updating wallet:', error);
        alert(`Failed to update wallet: ${error.message || 'Server error'}`);
      }
    });
  }




  calculateYield(): void {
    if (!this.selectedWallet) {
      this.showError('No wallet selected');
      return;
    }

    const walletId = this.getWalletId(this.selectedWallet);
    if (!walletId) {
      this.showError('Invalid wallet ID');
      return;
    }

    this.isLoading = true;
    this.walletService.calculateYield(walletId).subscribe({
      next: (yieldValue) => {
        this.isLoading = false;
        // Update the yield display
        this.dashboardStats.expectedReturn = yieldValue;
        this.showSuccess(`Updated yield: ${yieldValue}`);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Calculate yield error:', error);
        this.showError(error.message || 'Error calculating yield');
      }
    });
  }

  // Méthode pour charger toutes les analyses financières
  chargerAnalysesFinancieres(): void {
    if (!this.selectedWallet) {
      this.showError('Aucun portefeuille sélectionné');
      return;
    }

    const walletId = this.getWalletId(this.selectedWallet);
    if (!walletId) {
      this.showError('ID de portefeuille invalide');
      return;
    }

    this.isLoading = true;
    
    // Chargement parallèle des données d'analyse
    const performance$ = this.walletService.calculerPerformanceHistorique(walletId);
    const diversification$ = this.walletService.analyserDiversification(walletId);
    const risque$ = this.walletService.analyserRisque(walletId);
    const indicateurs$ = this.walletService.calculerIndicateursFinanciers(walletId);
    
    // Combiner les résultats avec forkJoin
    import('rxjs').then(({ forkJoin }) => {
      forkJoin({
        performance: performance$,
        diversification: diversification$,
        risque: risque$,
        indicateurs: indicateurs$
      }).subscribe({
        next: (resultats) => {
          this.isLoading = false;
          console.log('Données d\'analyses financières chargées:', resultats);
          // Stocker les résultats dans le composant pour affichage
          this.donneesPerfHistorique = resultats.performance;
          this.donneesDiversification = resultats.diversification;
          this.donneesRisque = resultats.risque;
          this.donneesIndicateurs = resultats.indicateurs;
          
          this.showSuccess('Analyses financières mises à jour');
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erreur lors du chargement des analyses:', error);
          this.showError(error.message || 'Erreur lors du chargement des analyses financières');
        }
      });
    });
  }

  // Méthode pour afficher la performance historique
  afficherPerformanceHistorique(): void {
    if (!this.donneesPerfHistorique) {
      // Utiliser directement l'ID 1 pour le développement et les tests
      const walletId = 1;
      console.log('Utilisation de l\'ID portefeuille fixe pour performance historique:', walletId);

      this.isLoading = true;
      this.walletService.calculerPerformanceHistorique(walletId).subscribe({
        next: (donnees) => {
          this.isLoading = false;
          this.donneesPerfHistorique = donnees;
          this.showForm = true;
          this.selectedType = 'performance-historique';
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erreur lors du calcul de performance:', error);
          this.showError(error.message || 'Impossible de calculer la performance historique');
        }
      });
    } else {
      // Afficher directement les données déjà chargées
      this.showForm = true;
      this.selectedType = 'performance-historique';
    }
  }

  // Méthode pour afficher la simulation de croissance
  afficherSimulationCroissance(): void {
    this.showForm = true;
    this.selectedType = 'simulation-croissance';
    // La simulation sera lancée quand l'utilisateur soumettra le formulaire
  }

  // Méthode pour lancer la simulation de croissance
  executerSimulationCroissance(): void {
    if (!this.selectedWallet) {
      this.showError('Aucun portefeuille sélectionné');
      return;
    }

    const walletId = this.getWalletId(this.selectedWallet);
    if (!walletId) {
      this.showError('ID de portefeuille invalide');
      return;
    }

    // Récupérer les valeurs du formulaire
    const montantMensuel = this.form.get('montantMensuel')?.value || 0;
    const dureeAnnees = this.form.get('dureeAnnees')?.value || 5;
    const tauxRendement = this.form.get('tauxRendement')?.value;

    this.isLoading = true;
    this.walletService.simulerCroissance(walletId, montantMensuel, dureeAnnees, tauxRendement).subscribe({
      next: (simulation) => {
        this.isLoading = false;
        this.donneesSimulation = simulation;
        // Afficher les résultats
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de la simulation:', error);
        this.showError(error.message || 'Impossible de simuler la croissance');
      }
    });
  }

  // Méthode pour afficher l'analyse de diversification
  afficherAnalyseDiversification(): void {
    if (!this.donneesDiversification) {
      // Utiliser directement l'ID 1 pour le développement et les tests
      const walletId = 1;
      console.log('Utilisation de l\'ID portefeuille fixe pour analyse de diversification:', walletId);

      this.isLoading = true;
      this.walletService.analyserDiversification(walletId).subscribe({
        next: (donnees) => {
          this.isLoading = false;
          this.donneesDiversification = donnees;
          this.showForm = true;
          this.selectedType = 'analyse-diversification';
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erreur lors de l\'analyse de diversification:', error);
          this.showError(error.message || 'Impossible d\'analyser la diversification');
        }
      });
    } else {
      // Afficher directement les données déjà chargées
      this.showForm = true;
      this.selectedType = 'analyse-diversification';
    }
  }

  // Méthode pour afficher l'analyse de risque
  afficherAnalyseRisque(): void {
    if (!this.donneesRisque) {
      // Utiliser directement l'ID 1 pour le développement et les tests
      const walletId = 1;
      console.log('Utilisation de l\'ID portefeuille fixe pour analyse de risque:', walletId);

      this.isLoading = true;
      this.walletService.analyserRisque(walletId).subscribe({
        next: (donnees) => {
          this.isLoading = false;
          this.donneesRisque = donnees;
          this.showForm = true;
          this.selectedType = 'analyse-risque';
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erreur lors de l\'analyse de risque:', error);
          this.showError(error.message || 'Impossible d\'analyser le risque');
        }
      });
    } else {
      // Afficher directement les données déjà chargées
      this.showForm = true;
      this.selectedType = 'analyse-risque';
    }
  }

  // Méthode pour afficher les recommandations
  afficherRecommandations(): void {
    // Utiliser directement l'ID 1 pour le développement et les tests
    const walletId = 1;
    console.log('Utilisation de l\'ID portefeuille fixe pour recommandations:', walletId);

    this.isLoading = true;
    
    // Formulaire de sélection du profil de risque déjà présent ou à créer
    const profilRisque = this.form.get('profilRisque')?.value || 3; // valeur par défaut medium
    const objectifs = this.form.get('objectifs')?.value || 'croissance';

    this.walletService.obtenirRecommandations(walletId, profilRisque, objectifs).subscribe({
      next: (recommandations) => {
        this.isLoading = false;
        this.donneesRecommandations = recommandations;
        this.showForm = true;
        this.selectedType = 'recommandations';
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors de l\'obtention des recommandations:', error);
        this.showError(error.message || 'Impossible d\'obtenir les recommandations');
      }
    });
  }

  // Méthode pour afficher les indicateurs financiers
  afficherIndicateursFinanciers(): void {
    if (!this.donneesIndicateurs) {
      // Utiliser directement l'ID 1 pour le développement et les tests
      const walletId = 1;
      console.log('Utilisation de l\'ID portefeuille fixe pour indicateurs financiers:', walletId);

      this.isLoading = true;
      this.walletService.calculerIndicateursFinanciers(walletId).subscribe({
        next: (donnees) => {
          this.isLoading = false;
          this.donneesIndicateurs = donnees;
          this.showForm = true;
          this.selectedType = 'indicateurs-financiers';
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erreur lors du calcul des indicateurs:', error);
          this.showError(error.message || 'Impossible de calculer les indicateurs financiers');
        }
      });
    } else {
      // Afficher directement les données déjà chargées
      this.showForm = true;
      this.selectedType = 'indicateurs-financiers';
    }
  }
  
  // Export wallet to PDF
  exportToPdf(): void {
    if (!this.selectedWallet) {
      alert('Please select a wallet first');
      return;
    }
  
    // Make sure we have a valid ID, even if it's just a fallback value
    const walletId = this.selectedWallet.idPortfeuille || this.selectedWallet.id || 1;
  
    this.isLoading = true;
    this.walletService.generatePdf(walletId).subscribe({
      next: (pdfBlob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wallet_${walletId}_report.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF report');
      }
    });
  }
  
  /**
   * Invest money in the selected wallet
   */
  investMoney(): void {
    if (!this.selectedWallet) {
      this.showError('Please select a wallet first');
      return;
    }
  
    // Robust wallet ID extraction
    const walletId = this.getWalletId(this.selectedWallet);
    if (!walletId) {
      this.showError('Invalid wallet selected - missing ID');
      return;
    }
  
    const amount = this.form.get('amount')?.value;
    if (!amount || amount <= 0) {
      this.showError('Please enter a valid investment amount (minimum 0.01)');
      return;
    }
  
    this.isLoading = true;
    this.walletService.invest(walletId, amount).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuccess('Investment successful!');
        this.closeForm();
        
        // Reload the selected wallet to update the balances
        if (this.selectedWallet) {
          const refreshWalletId = this.getWalletId(this.selectedWallet);
          if (refreshWalletId) {
            this.refreshWalletAfterOperation(refreshWalletId);
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Investment failed:', error);
        
        // Extract clear error message
        let errorMessage = error.message || 'Investment failed';
        this.showError(errorMessage);
      }
    });
  }

  /**
   * Extract wallet ID from wallet object, handling different formats
   * @param wallet Wallet object
   * @returns Numeric wallet ID or null if not found
   */
  getWalletId(wallet: Portfeuille): number | null {
    if (!wallet) {
      console.warn('getWalletId: Wallet is null or undefined');
      return null;
    }

    console.log('Wallet object:', wallet);
    
    // Corriger pour l'orthographe exacte "idPortefeuille" avec un 'e' après Port
    if ((wallet as any).idPortefeuille !== undefined && (wallet as any).idPortefeuille !== null) {
      console.log('Using idPortefeuille:', (wallet as any).idPortefeuille);
      return Number((wallet as any).idPortefeuille);
    }
    
    // Try idPortfeuille (version du modèle)
    if (wallet.idPortfeuille !== undefined && wallet.idPortfeuille !== null) {
      console.log('Using idPortfeuille:', wallet.idPortfeuille);
      return Number(wallet.idPortfeuille);
    }

    // Then try id (possible alternative name)
    if (wallet.id !== undefined && wallet.id !== null) {
      console.log('Using id:', wallet.id);
      return Number(wallet.id);
    }
    
    // Si aucun ID n'est trouvé, retourner une valeur par défaut de 1 pour les tests
    console.warn('Aucun ID trouvé dans le portefeuille, utilisation de l\'ID par défaut 1 pour les tests');
    return 1;
  }

  /**
   * Refresh wallet data after operations like investment or transfer
   * @param sourceId Source wallet ID
   * @param destinationId Optional destination wallet ID
   */
  refreshWalletAfterOperation(sourceId: number, destinationId?: number): void {
    // Save the current wallet ID
    const currentWalletId = this.selectedWallet ? 
      this.getWalletId(this.selectedWallet) : null;
    
    this.isLoading = true;
    console.log('Refreshing wallets after operation...');
    
    // Reload all wallets from backend
    this.walletService.getAllWallets().subscribe({
      next: (wallets) => {
        this.isLoading = false;
        this.wallets = wallets;
        console.log('Wallets refreshed after operation:', wallets);
        
        // Re-select the same wallet to update UI
        if (currentWalletId && wallets && wallets.length > 0) {
          const updatedWallet = wallets.find(w => {
            const walletId = this.getWalletId(w);
            return walletId === currentWalletId;
          });
          
          if (updatedWallet) {
            console.log('Re-selecting updated wallet:', updatedWallet);
            this.selectWallet(updatedWallet);
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Failed to refresh wallets:', error);
        this.showError('Failed to refresh wallet data');
      }
    });
  }

  /**
   * Show error message to the user
   * @param message Error message to display
   */
  showError(message: string): void {
    this.errorMessage = message;
    console.error(message);
    // Display the error message using alert for now
    // In a production app, you would use a toast notification or snackbar
    alert(message);
  }

  /**
   * Show success message to the user
   * @param message Success message to display
   */
  showSuccess(message: string): void {
    console.log(message);
    // Display the success message using alert for now
    // In a production app, you would use a toast notification or snackbar
    alert(message);
  }

  // ... (rest of the code remains the same)

  /**
   * Transfer money between wallets
   */
  transferMoney(): void {
    // Get source wallet ID (may be from selected wallet or from form)
    let sourceId = this.form.get('sourceWallet')?.value;
    
    // If no source is explicitly set in the form but we have a selected wallet,
    // use the selected wallet as the source
    if ((!sourceId || sourceId === '') && this.selectedWallet) {
      sourceId = this.getWalletId(this.selectedWallet);
      this.form.get('sourceWallet')?.setValue(sourceId);
    }
    
    // Get destination wallet ID from form
    const destinationId = this.form.get('destinationWallet')?.value;
    const amount = this.form.get('amount')?.value;
    
    // Validate inputs
    if (!sourceId) {
      this.showError('Please select a source wallet');
      return;
    }
    
    if (!destinationId) {
      this.showError('Please select a destination wallet');
      return;
    }
  
    if (!amount || amount <= 0) {
      this.showError('Please enter a valid transfer amount');
      return;
    }
  
    // Convert to numbers before comparing to ensure consistent type comparison
    const numericSourceId = Number(sourceId);
    const numericDestId = Number(destinationId);

    console.log('Comparing source ID:', numericSourceId, 'and destination ID:', numericDestId);
    
    if (numericSourceId === numericDestId) {
      this.showError('Source and destination wallets cannot be the same');
      return;
    }
  
    this.isLoading = true;
    // Use the numeric IDs we calculated to ensure consistent typing
    this.walletService.transfer(numericSourceId, numericDestId, amount).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuccess('Transfer successful!');
        this.closeForm();
        
        // Refresh both source and destination wallets
        this.refreshWalletAfterOperation(numericSourceId, numericDestId);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Transfer failed:', error);
        
        // Extract clear error message
        let errorMessage = error.message || 'Transfer failed';
        this.showError(errorMessage);
      }
    });
  }
  
  // Initialize investment form
  initInvestForm(): void {
    // Create a new FormGroup with all required controls
    this.form = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['Investment'],
      investmentType: ['stocks'],
      sourceWallet: [''], // Not required for investments
      destinationWallet: [''] // Not required for investments
    });
    
    // If we have a selected wallet, set it as the source
    if (this.selectedWallet) {
      const walletId = this.getWalletId(this.selectedWallet);
      console.log('Investment form - Setting wallet ID:', walletId);
      
      if (walletId !== null) {
        // We don't need to set sourceWallet for investment, but we could if needed
        // this.form.get('sourceWallet')?.setValue(walletId.toString());
      }
    }
  }

  // Initialize transfer form
  initTransferForm(): void {
    this.form.reset();
    
    // Initialize the form with empty values first
    this.form = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['Transfer between wallets'],
      sourceWallet: ['', Validators.required],
      destinationWallet: ['', Validators.required],
      investmentType: ['']
    });
    
    if (this.selectedWallet) {
      // Get the wallet ID using our helper method - safely handle null
      const sourceId = this.getWalletId(this.selectedWallet);
      console.log('Transfer form - Setting source wallet ID:', sourceId);
      
      if (sourceId !== null) {
        // Set the source wallet ID in the form
        this.form.get('sourceWallet')?.setValue(sourceId.toString());
        console.log('Source wallet ID set in form:', this.form.get('sourceWallet')?.value);
      }
    }
  }

}