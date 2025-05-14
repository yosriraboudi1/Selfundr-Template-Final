// transaction.model.ts
export interface Transaction {
  idTransaction?: number;
  date:  Date | string; // ISO format date string
  montant: number;
  typeTransaction: TypeTransaction;
  recipient: string;
  paymentReference: string;
  toCompteId?: number;
  userId?: number;
}
export enum TypeTransaction {
  DEPOT = 'DEPOT',
  PAIEMENT = 'PAIEMENT',
  RETRAIT = 'RETRAIT',
  VIREMENT = 'VIREMENT'
}