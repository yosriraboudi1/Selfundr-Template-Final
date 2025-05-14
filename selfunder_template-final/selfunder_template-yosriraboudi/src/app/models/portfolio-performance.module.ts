export interface PortfolioPerformance {
  portfolioId: number;
  titreProjet: string;
  montantCollecte: number;
  montantRecherche: number;
  progressPercentage: number;
  currentValue: number;
  rendementPrevisionnel: number;
  forecasts: { [key: string]: number };
  error?: null;
}
