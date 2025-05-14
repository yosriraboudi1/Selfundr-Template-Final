import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompteBancaire, User } from '../models/compte-bancaire.model';

@Injectable({
  providedIn: 'root'
})
export class CompteBancaireService {
  private apiUrl = 'http://localhost:8080/compteBancaire';

  constructor(private http: HttpClient) {}

  createCompte(userId: number, compte: any): Observable<any> {
  return this.http.post(`http://localhost:8080/compteBancaire/add-compteBancaire?userId=${userId}`, compte);
}



  getAllComptes(): Observable<CompteBancaire[]> {
    return this.http.get<CompteBancaire[]>(`${this.apiUrl}/retrieve-all-compteBancaires`);
  }

  getCompteById(id: number): Observable<CompteBancaire> {
    return this.http.get<CompteBancaire>(`${this.apiUrl}/retrieve-compteBancaire/${id}`);
  }



  updateCompte(compte: CompteBancaire): Observable<CompteBancaire> {
    return this.http.put<CompteBancaire>(`${this.apiUrl}/modify-compteBancaire/${compte.idCompte}`, compte);
  }

  deleteCompte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-compteBancaire/${id}`);
  }
  getComptesByUser(userId: number): Observable<CompteBancaire[]> {
    return this.http.get<CompteBancaire[]>(`${this.apiUrl}/getcomptes/${userId}`);
  }
}
