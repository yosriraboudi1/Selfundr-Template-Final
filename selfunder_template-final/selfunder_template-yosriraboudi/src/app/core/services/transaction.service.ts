import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders,HttpErrorResponse } from '@angular/common/http';

import { Transaction } from '../models/transaction.model';
import { catchError, map } from 'rxjs/operators';

import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8085/transaction';

  constructor(private http: HttpClient) {}

  // getAllTransactions(): Observable<any[]> {
  //   return this.http.get(`${this.apiUrl}/all`, { responseType: 'text' }).pipe(
  //     map(response => {
  //       try {
  //         // First validate JSON structure
  //         if (!this.isValidJson(response)) {
  //           response = JSON.parse(response);
  //         }
  //         return JSON.parse(response);
  //       } catch (e) {
  //         console.error('Failed to parse JSON:', response);
  //         throw new Error('Server returned invalid data format');
  //       }
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  // private isValidJson(str: string): boolean {
  //   try {
  //     JSON.parse(str);
  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // }

  // private fixJsonStructure(badJson: string): string {
  //   // Fix common JSON issues
  //   let fixed = badJson
  //     .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Ensure proper key quoting
  //     .replace(/:\s*([^"{\[\d][^,]*?)([,}])/g, ':"$1"$2') // Quote unquoted string values
  //     .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
  //     .replace(/([{\[])\s*([}\]])/g, '$1$2'); // Remove empty objects/arrays

  //   // If still invalid, try to extract valid portion
  //   if (!this.isValidJson(fixed)) {
  //     const start = fixed.indexOf('[');
  //     const end = fixed.lastIndexOf(']') + 1;
  //     if (start >= 0 && end > start) {
  //       fixed = fixed.substring(start, end);
  //     }
  //   }
  //   return fixed;
  // }

  // private handleError(error: HttpErrorResponse) {
  //   let errorMessage = 'Unknown error occurred';
  //   if (error.error instanceof ErrorEvent) {
  //     errorMessage = `Client error: ${error.error.message}`;
  //   } else if (error.status === 0) {
  //     errorMessage = 'Server unavailable - check your network';
  //   } else {
  //     errorMessage = `Server error: ${error.status} - ${error.message}`;
  //   }
  //   console.error('API Error:', error);
  //   return throwError(() => new Error(errorMessage));
  // }
  getAllTransactions(): Observable<Transaction[]> {
    const url = `${this.apiUrl}/all`;
  
    // Ensure responseType is JSON to avoid parsing errors
    return this.http.get<Transaction[]>(url, { responseType: 'json' });
  }
  

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  createTransaction(
    userId: number,
    compteId: number,
    transactionData: Partial<Transaction>
  ): Observable<Transaction> {
    // Ensure `toCompteId` is correctly formatted
    const validTransactionData: Partial<Transaction> = {
      ...transactionData,
      toCompteId: transactionData.toCompteId ? Number(transactionData.toCompteId) : undefined // Ensure it's a number
    };
  
    // Set correct headers for JSON request
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    // Send request with JSON data
    return this.http.post<Transaction>(
      `${this.apiUrl}/createTransaction`,
      validTransactionData,
      { headers, params: new HttpParams().set('userId', userId.toString()).set('compteId', compteId.toString()) }
    );
  }
  
  

  updateTransaction(id: number, transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTransactionsByUser(userId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/user/${userId}`);
  }

  filterTransactions(type: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/filter?type=${type}`);
  }
  private repairJson(badJson: string): string {
    // Fix common JSON issues
    return badJson
      .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
      .replace(/([{,])(\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$3":') // Add quotes to keys
      .replace(/:([^"\d][^,]*?)([,}])/g, ':"$1"$2') // Add quotes to unquoted string values
      .replace(/}\s*{/g, '},{') // Fix missing commas between objects
      .replace(/\]\s*{/g, '],{') // Fix missing commas after arrays
      .replace(/}\s*\]/g, '}]') // Fix missing commas before array ends
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  
  
} 