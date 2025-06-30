import { Injectable } from '@angular/core';
import { Contact } from '../interfaces/Contact';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  apiUrl = "https://enzoaguiar.duckdns.org/contacts";

  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl);
  }

  getFavorite(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/favorites`);
  }

  save(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  update(contact: Contact): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${contact.id}`, contact);
  }

  updateFavorite(contactId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${contactId}/favorite`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}