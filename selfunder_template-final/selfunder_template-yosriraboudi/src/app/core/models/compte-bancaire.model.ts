export enum TypeCompteBancaire {
  COURANT = 'COURANT',
  EPARGNE = 'EPARGNE',
  PROFESSIONNEL = 'PROFESSIONNEL'
}

export interface CompteBancaire {
  idCompte?: number;
  iban: string;
  rib: string;
  codeBanque: string;
  solde: number;
  devise: string;
  typeCompteBancaire: TypeCompteBancaire;
  userId?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
}
