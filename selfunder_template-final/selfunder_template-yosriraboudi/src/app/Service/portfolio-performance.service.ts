import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {PortfolioPerformance} from "../models/portfolio-performance";

@Injectable({
  providedIn: 'root'
})
export class PortfolioPerformanceService {

  private apiUrl = 'api/portfolio-performance';

  constructor(private http: HttpClient) {}

  getPortfolioPerformance(portfolioId: number): Observable<PortfolioPerformance> {
    return this.http.get<PortfolioPerformance>(`${this.apiUrl}/${portfolioId}`);
  }
}
