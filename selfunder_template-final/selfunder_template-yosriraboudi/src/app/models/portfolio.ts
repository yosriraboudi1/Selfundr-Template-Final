export enum StatutProjet {
  En_Cours = 'En_Cours',
  Financé = 'Financé',
  Annulé = 'Annulé',
  Echec = 'Echec'
}

export interface Portfolio {
  idPortfolio?: number;
  titreProjet: string;
  descriptionProjet: string;
  montantRecherche: number;
  montantCollecte: number;
  dateCreation?: string;
  rendementPrevisionnel: number;
  statutProjet: StatutProjet;
  userId: number;
}
