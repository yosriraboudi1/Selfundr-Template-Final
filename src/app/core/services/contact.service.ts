import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from './../models/Contact';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private apiUrl = 'http://localhost:8080/api/contacts';

    constructor(private http: HttpClient) { }

    createContact(contact: Contact): Observable<Contact> {
        return this.http.post<Contact>(this.apiUrl, contact);
    }
    getAllContacts(): Observable<Contact[]> {
      return this.http.get<Contact[]>(`${this.apiUrl}/contactlist`);
    }
}
