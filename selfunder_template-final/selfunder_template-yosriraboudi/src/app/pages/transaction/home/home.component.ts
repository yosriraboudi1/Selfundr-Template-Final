import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { TransactionService } from '../../../core/services/transaction.service'
import { Transaction ,TypeTransaction} from '../../../core/models/transaction.model'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { Router } from '@angular/router';

type ActionType = 'send' | 'receive' | 'transfer' | 'payment' | 'bills' | 'savings'
type TransactionType = Transaction['typeTransaction'] // Use the type from Transaction interface

interface TransactionFilter {
  type: string
  label: string
  icon: string
}

@Component({
  selector: 'app-transactions-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeTrComponent implements OnInit {
  transactions: Transaction[] = [];
  loading = true;
  TypeTransaction = TypeTransaction;
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  isDarkTheme = false
  isAuthenticated = true
  balance = 25000
  activeModal: ActionType | null = null
  actionForm!: FormGroup; // Declare but do not initialize
  recentTransactions: Transaction[] = []
  filteredTransactions: Transaction[] = []
  currentFilter = 'all'


  transactionFilters: TransactionFilter[] = [
    { type: 'all', label: 'All Transactions', icon: 'bi bi-grid' },
    { type: 'send', label: 'Sent', icon: 'bi bi-send' },
    { type: 'receive', label: 'Received', icon: 'bi bi-download' },
    { type: 'transfer', label: 'Transfers', icon: 'bi bi-arrow-left-right' },
    { type: 'payment', label: 'Payments', icon: 'bi bi-credit-card' },
    { type: 'bills', label: 'Bills', icon: 'bi bi-receipt' },
    { type: 'savings', label: 'Savings', icon: 'bi bi-piggy-bank' }
  ]

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.actionForm = this.initializeForm();
    this.loadTransactions()
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      montant: ['', [Validators.required, Validators.min(0.01)]],
      typeTransaction: ['', Validators.required],
      recipient: [''],
      paymentReference: [''],
      toCompteId: [null]
    })
  }

  
  loadTransactions(): void {
    this.loading = true;
    this.transactionService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading transactions', err);
        this.loading = false;
        alert('Failed to load transactions');
      }
    });
  }

  filterTransactions(type: string): void {
    this.currentFilter = type
    
    if (type === 'all') {
      this.filteredTransactions = [...this.recentTransactions]
    } else {
      this.filteredTransactions = this.recentTransactions.filter(tx => tx.typeTransaction === type as TransactionType)
    }
  }

  openActionModal(type: ActionType): void {
    this.activeModal = type
    this.actionForm.reset({
      paymentMethod: 'RETRAIT'
    })

    // Reset all validators first
    Object.keys(this.actionForm.controls).forEach(key => {
      this.actionForm.get(key)?.clearValidators()
    })

    // Set required validators based on modal type
    switch (type) {
      case 'send':
        this.actionForm.get('recipient')?.setValidators([Validators.required])
        this.actionForm.get('montant')?.setValidators([Validators.required, Validators.min(0)])
        this.actionForm.get('paymentReference')?.setValidators([Validators.required])
        break
      case 'transfer':
        this.actionForm.get('bankAccount')?.setValidators([Validators.required])
        this.actionForm.get('montant')?.setValidators([Validators.required, Validators.min(0)])
        break
      case 'payment':
        this.actionForm.get('paymentFor')?.setValidators([Validators.required])
        this.actionForm.get('montant')?.setValidators([Validators.required, Validators.min(0)])
        this.actionForm.get('paymentMethod')?.setValidators([Validators.required])
        break
      case 'bills':
        this.actionForm.get('billType')?.setValidators([Validators.required])
        this.actionForm.get('montant')?.setValidators([Validators.required, Validators.min(0)])
        break
      case 'savings':
        this.actionForm.get('goalName')?.setValidators([Validators.required])
        this.actionForm.get('targetmontant')?.setValidators([Validators.required, Validators.min(0)])
        this.actionForm.get('monthlyContribution')?.setValidators([Validators.required, Validators.min(0)])
        break
    }

    // Update validators
    Object.keys(this.actionForm.controls).forEach(key => {
      const control = this.actionForm.get(key)
      control?.updateValueAndValidity()
    })
  }

  closeModal(): void {
    this.activeModal = null
  }

  getModalIcon(): string {
    switch (this.activeModal) {
      case 'send':
        return 'bi bi-send'
      case 'receive':
        return 'bi bi-download'
      case 'transfer':
        return 'bi bi-arrow-left-right'
      case 'payment':
        return 'bi bi-credit-card'
      case 'bills':
        return 'bi bi-receipt'
      case 'savings':
        return 'bi bi-piggy-bank'
      default:
        return 'bi bi-question-circle'
    }
  }

  getModalTitle(): string {
    switch (this.activeModal) {
      case 'send':
        return 'Send Money'
      case 'receive':
        return 'Receive Money'
      case 'transfer':
        return 'Bank Transfer'
      case 'payment':
        return 'Make Payment'
      case 'bills':
        return 'Pay Bills'
      case 'savings':
        return 'Savings Goals'
      default:
        return ''
    }
  }

  getTransactionIcon(type: TransactionType): string {
    switch (type) {
      case 'DEPOT':
      case 'RETRAIT':
        return 'bi bi-arrow-down-circle-fill'
      
      case 'PAIEMENT':
        return 'bi bi-arrow-up-circle-fill'
      case 'VIREMENT':
        return 'bi bi-arrow-left-right'
      
     
      
      default:
        return 'bi bi-question-circle-fill'
    }
  }

  submitAction(): void {
    if (this.actionForm.valid && this.activeModal) {
      const userId = 1;
      const formData = this.actionForm.value
      const transaction: Partial<Transaction> = {
        montant: formData.montant,
        paymentReference: formData.paymentReference || this.getDefaultpaymentReference(this.activeModal, formData),
        typeTransaction: this.activeModal as TransactionType,
        date: new Date(),
        toCompteId: 1
      }

      if (this.activeModal === 'send' || this.activeModal === 'transfer') {
        transaction.recipient = formData.recipient;
        transaction.typeTransaction=TypeTransaction.VIREMENT;
      }

      if (this.activeModal === 'payment') {
        transaction.typeTransaction = TypeTransaction.PAIEMENT;
        
      }
      if (this.activeModal === 'receive') {
        transaction.typeTransaction = TypeTransaction.DEPOT;
        
      }
      console.log("Final Transaction Data:", formData); // Debugging
      
      console.log("Données envoyées :", transaction);

      this.transactionService.createTransaction(userId, 1, transaction).subscribe({
        next: (createdTransaction) => {
          console.log('Transaction created successfully:', createdTransaction);
          this.router.navigate(['/transaction']);
        },
        error: (err) => {
          console.error('Error creating transaction:', err);
          alert('An error occurred while creating the transaction. Please try again.');
        }
      })
    }
  }

  private getDefaultpaymentReference(type: ActionType, formData: any): string {
    switch (type) {
      case 'send':
        return `Money sent to ${formData.recipient}`
      case 'receive':
        return 'Money received'
      case 'transfer':
        return `Transfer to ${formData.bankAccount} account`
      case 'payment':
        return `Payment for ${formData.paymentFor}`
      case 'bills':
        return `${formData.billType} bill payment`
      case 'savings':
        return `Savings goal: ${formData.goalName}`
      default:
        return ''
    }
  }

  private updateBalance(transaction: Transaction): void {
    if (transaction.typeTransaction === 'DEPOT' || transaction.typeTransaction === 'RETRAIT') {
      this.balance += transaction.montant
    } else if (['DEPOT', 'PAIEMENT', 'VIREMENT', 'bills', 'savings'].includes(transaction.typeTransaction)) {
      this.balance -= transaction.montant
    }
  }
  
} 