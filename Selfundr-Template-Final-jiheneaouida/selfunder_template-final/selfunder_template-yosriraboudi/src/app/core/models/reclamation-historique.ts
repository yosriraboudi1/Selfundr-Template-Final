import { Reclamation } from "./reclamation";

export interface ReclamationHistorique {
  id?: number; // Optional since it might not be set initially
  reclamation: Reclamation; // Reference to the Reclamation entity
  oldStatut: string; // Previous status
  newStatut: string; // New status
  createdDate?: Date; // Optional, as it will be set by the backend
}
