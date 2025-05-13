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

  createCompte(userId: number, compte: CompteBancaire): Observable<CompteBancaire> {
    return this.http.post<CompteBancaire>(`${this.apiUrl}/add-compteBancaire/${userId}`, compte);
  }

  getAllComptes(): Observable<CompteBancaire[]> {
    return this.http.get<CompteBancaire[]>(`${this.apiUrl}/retrieve-all-compteBancaires`);
  }

  getCompteById(id: number): Observable<CompteBancaire> {
    return this.http.get<CompteBancaire>(`${this.apiUrl}/retrieve-compteBancaire/${id}`);
  }

  getComptesByUser(userId: number): Observable<CompteBancaire[]> {
    return this.http.get<CompteBancaire[]>(`${this.apiUrl}/comptes/user/${userId}`);
  }

  updateCompte(compte: CompteBancaire): Observable<CompteBancaire> {
    return this.http.put<CompteBancaire>(`${this.apiUrl}/modify-compteBancaire/${compte.idCompte}`, compte);
  }

  deleteCompte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-compteBancaire/${id}`);
  }
}
