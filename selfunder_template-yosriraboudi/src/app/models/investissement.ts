export enum ModePaiement {
  CARTE_BANCAIRE = 'CARTE_BANCAIRE',
  VIREMENT = 'VIREMENT'
}

export enum StatutInvestissement {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Investissement {
  idInvestissement?: number;
  montantInvestissement: number;
  dateInvestissement?: string;
  pourcentageParticipation: number;
  rendementEstime: number;
  dureeEngagement?: number;
  modePaiement: ModePaiement;
  statutInvestissement?: StatutInvestissement;
  portfolio?: { idPortfolio: number };
  user?: { id: number };
}