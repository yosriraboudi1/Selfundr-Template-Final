import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';



export enum TypeFormation {
  WEBINAIR = 'WEBINAIR',
  PDF = 'PDF',
  VIDEO = 'VIDEO'
}

export enum StatutFormation {
  En_Cours = 'En_Cours',
  Complète = 'Complète'
}

export interface Formation {
  idFormation?: number;
  titre?: string;
  description?: string;
  duree?: number;
  prix?: number;
  certificat?: boolean;
  noteMoyenne?: number;
  notesUsers?: number[];
  typeFormation?: TypeFormation;
  statutFormation?: StatutFormation;
  users?: any[];
  formationFileUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormationService {

  private apiUrl = "http://localhost:8085/formations";

  constructor(private http: HttpClient) { }

  /**
   * Crée une nouvelle formation avec fichier optionnel
   * Conforme à l'endpoint POST /formations qui attend un formulaire multipart
   */
  createFormation(formation: any, file?: File | null): Observable<Formation> {
    const formData = new FormData();
    formData.append('formation', JSON.stringify(formation));
    
    if (file) {
      formData.append('file', file);
    }

    return this.http.post<Formation>(this.apiUrl, formData);
  }

  /**
   * Récupère un fichier associé à une formation
   * Conforme à l'endpoint GET /formations/file/{titleID}/{fileName}
   */
  getFormationFile(titleID: string, fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/file/${titleID}/${fileName}`, {
      responseType: 'blob'
    });
  }

  /**
   * Met à jour une formation
   * Conforme à l'endpoint PUT /formations/{id}
   * Gère le cas avec fichier et sans fichier
   */
  updateFormation(id: number, formation: Formation, file?: File | null): Observable<Formation> {
    if (file) {
      // Si un fichier est fourni, utiliser FormData (le backend devrait être adapté)
      const formData = new FormData();
      formData.append('formation', JSON.stringify(formation));
      formData.append('file', file);
      
      // Si le backend n'accepte pas encore le multipart pour le PUT, il faudra l'adapter
      return this.http.put<Formation>(`${this.apiUrl}/${id}`, formData);
    } else {
      // Sans fichier, envoyer directement l'objet formation
      return this.http.put<Formation>(`${this.apiUrl}/${id}`, formation);
    }
  }

  /**
   * Supprime une formation
   * Conforme à l'endpoint DELETE /formations/{id}
   */
  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupère une formation par son ID
   * Conforme à l'endpoint GET /formations/{id}
   */
  getFormationById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupère toutes les formations
   * Conforme à l'endpoint GET /formations
   */
  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }

  /**
   * Récupère les statistiques par type de formation
   * Conforme à l'endpoint GET /formations/stats/type
   */
  getCountByType(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/stats/type`);
  }

  /**
   * Récupère les statistiques par statut de formation
   * Conforme à l'endpoint GET /formations/stats/statut
   */
  getCountByStatut(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/stats/statut`);
  }

  /**
   * Récupère les statistiques par certification de formation
   * Conforme à l'endpoint GET /formations/stats/certification
   */
  getCountByCertification(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/stats/certification`);
  }

  /**
   * Soumet une note à une formation
   * Conforme à l'endpoint POST /formations/{id}/note
   */
  soumettreNote(id: number, note: number): Observable<string> {
    const params = new HttpParams().set('note', note.toString());
    return this.http.post(`${this.apiUrl}/${id}/note`, null, { 
      params, 
      responseType: 'text' 
    });
  }

  /**
   * Filtre les formations par note moyenne
   * Conforme à l'endpoint GET /formations/filtrer
   */
  filtrerParNoteMoyenne(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/filtrer`);
  }

  /**
   * Récupère la formation avec la meilleure note
   * Conforme à l'endpoint GET /formations/top-formation
   */
  getFormationAvecMeilleureNote(): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/top-formation`);
  }

  /**
   * Recherche des formations par titre exact
   * Conforme à l'endpoint GET /formations/titre/{titre}
   */
  getFormationByTitre(titre: string): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/titre/${titre}`);
  }

  /**
   * Recherche des formations par mot-clé dans la description
   * Conforme à l'endpoint GET /formations/description/{motCle}
   */
  getFormationByDescription(motCle: string): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/description/${motCle}`);
  }

  /**
   * Recherche des formations par mot-clé dans le titre
   * Conforme à l'endpoint GET /formations/titre/search/{motCle}
   */
  getFormationByTitle(motCle: string): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/titre/search/${motCle}`);
  }}
