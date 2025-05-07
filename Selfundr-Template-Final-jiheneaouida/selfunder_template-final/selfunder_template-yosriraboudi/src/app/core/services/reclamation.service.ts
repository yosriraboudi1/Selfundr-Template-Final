import { saveAs } from 'file-saver';
import { Injectable } from '@angular/core';
import { Reclamation } from '../models/reclamation';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PageResponse } from '../models/page-response';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  public host = 'http://localhost:8080/api/reclamations';

  constructor(private http: HttpClient) { }

  createReclamation(idUser: number, reclamationJson: any, file?: File): Observable<number> {
    const formData = new FormData();
    formData.append('reclamationJson', JSON.stringify(reclamationJson));  // Must be a JSON string

    if (file) {
      formData.append('file', file);
    }

    const url = `${this.host}/${idUser}`;
    return this.http.post<number>(url, formData);
}

  updateReclamationStatus(idReclamation: number, newStatus: string): Observable<Reclamation> {
    const url = `${this.host}/${idReclamation}/status`; // Append id_reclamation and 'status' to the URL
    const params = { newStatus }; // Pass the new status as a query parameter

    return this.http.put<Reclamation>(url, null, { params });
  }
  deleteReclamation(id: number): Observable<void> {
    const url = `${this.host}/${id}`; // Append id to the URL
    return this.http.delete<void>(url);
  }
  getReclamationsByUser(userId: number, page: number = 0, size: number = 10): Observable<{ content: Reclamation[], totalPages: number }> {
    const url = `${this.host}/user/${userId}`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<{ content: Reclamation[], totalPages: number }>(url, { params });
  }
  getAllReclamations(): Observable<Reclamation[]> {
    const url = `${this.host}/list`; // Append 'list' to the base URL
    return this.http.get<Reclamation[]>(url);
  }
  getReclamationById(idReclamation: number): Observable<Reclamation> {
    const url = `${this.host}/${idReclamation}`; // Append id_reclamation to the URL
    return this.http.get<Reclamation>(url);
  }
  getStats(): Observable<any> {


      return this.http.get(`${this.host}/stats`, {});
    //}
  }

  downloadExcelFile(blob: Blob): void {
    saveAs(blob, 'reclamation_stats.xlsx');
  }

  getFilteredReclamations(
    statutReclam?: string,
    niveauUrgence?: string,
    categorie?: string,

    searchTerm?: string,
    page: number = 0,
    size: number = 10,
    order: string = 'DESC'
  ): Observable<PageResponse<Reclamation>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('order', order);

    if (statutReclam) params = params.set('statutReclam', statutReclam);
    if (niveauUrgence) params = params.set('niveauUrgence', niveauUrgence);
    if (categorie) params = params.set('categorie', categorie);

    if (searchTerm) params = params.set('searchTerm', searchTerm);

    return this.http.get<PageResponse<Reclamation>>(`${this.host}/filter/user`, { params });
  }


}
