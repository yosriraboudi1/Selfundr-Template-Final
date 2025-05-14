// wallet.model.ts
export enum StatutPortfeuille {
  Actif = 'Actif',
  Suspendu = 'Suspendu',
  Cloture = 'Cloture' // Removed accent for better compatibility
}

export interface Portfeuille {
  // Support both ID formats from backend
  id?: number; // Sometimes backend returns this
  idPortfeuille?: number; // Sometimes backend returns this
  idUser: number;
  valeurTotale: number;
  montantEpargne: number;
  montantInvestie: number;
  soldeDisponible: number;
  montantCredit: number;
  rendementPrevisionnel: number;
  dateCreation: Date | string; // String for ISO format from backend
  scoreFinancier: string;
  codePin: string;
  qrCode: string; // Or Blob for binary data
  statutPortfeuille: StatutPortfeuille;
}
