import { ReclamationHistorique } from "./reclamation-historique";

export interface Reclamation {
  id: number;
  description: string;
  statutReclam: StatutReclam;
  reclamationFile?: string;
  sujet: string;
  createdDate?: Date;
  user: User;
  historiqueStatut?: ReclamationHistorique[];
  categorie: CategorieReclamation;
  niveauUrgence: NiveauUrgence;
}

// Interface pour la pagination
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  last: boolean;
  first: boolean;
}

// Interface utilisée pour les filtres
export interface ReclamationFilter {
  statutReclam?: StatutReclam;
  niveauUrgence?: NiveauUrgence;
  categorie?: CategorieReclamation;
  userId?: number;
  searchTerm?: string;
  page?: number;
  size?: number;
  order?: string;
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

export enum NiveauUrgence {
  HAUTE = 'HAUTE',
  MOYENNE = 'MOYENNE',
  BASSE = 'BASSE'
}

export enum CategorieReclamation {
  PROBLEME_TRANSACTION = 'PROBLEME_TRANSACTION',
  COMPTE_BLOQUE = 'COMPTE_BLOQUE',
  ERREUR_SOLDE = 'ERREUR_SOLDE',
  AUTRES = 'AUTRES'
}

export enum StatutReclam {
  EN_COURS = 'EN_COURS',
  OUVERTE = 'OUVERTE',
  RESOLU = 'RESOLU'
}
