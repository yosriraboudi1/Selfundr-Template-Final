import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Investissement } from '../models/investissement';

@Injectable({
  providedIn: 'root'
})
export class InvestissementService {
  private apiUrl = 'http://localhost:8080/api/investissements';
  private approvalApiUrl = 'http://localhost:8080/api/investment-approvals';

  constructor(private http: HttpClient) {}

  createInvestissement(userId: number, portfolioId: number, investissement: Investissement): Observable<Investissement> {
    console.log('Creating investment:', { userId, portfolioId, investissement });
    return this.http.post<Investissement>(
      `${this.apiUrl}/user/${userId}/portfolio/${portfolioId}`,
      investissement
    );
  }

  getInvestissementsByUser(userId: number): Observable<Investissement[]> {
    return this.http.get<Investissement[]>(`${this.apiUrl}/user/${userId}`);
  }

  getInvestissementsByPortfolio(portfolioId: number): Observable<Investissement[]> {
    return this.http.get<Investissement[]>(`${this.apiUrl}/portfolio/${portfolioId}`);
  }

  updateInvestissement(id: number, investissement: Investissement): Observable<Investissement> {
    return this.http.put<Investissement>(`${this.apiUrl}/${id}`, investissement);
  }

  deleteInvestissement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  approveInvestment(id: number): Observable<{ message: string, id: string }> {
    return this.http.post<{ message: string, id: string }>(`${this.approvalApiUrl}/approve/${id}`, {});
  }

  rejectInvestment(id: number): Observable<{ message: string, id: string }> {
    return this.http.post<{ message: string, id: string }>(`${this.approvalApiUrl}/reject/${id}`, {});
  }

  getInvestmentCountsByPortfolio(): Observable<{ [key: number]: number }> {
    return this.http.get<{ [key: number]: number }>(`${this.apiUrl}/counts`);
  }
}
