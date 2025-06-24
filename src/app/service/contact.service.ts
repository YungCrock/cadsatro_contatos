// service/contact.service.ts

import { Injectable } from '@angular/core';
import { Contact } from '../interfaces/Contact';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  apiUrl = "http://localhost:8080/contacts";

  // Não há necessidade de armazenar 'contacts' ou 'contact' aqui,
  // pois o service deve ser stateless e apenas fazer as requisições.
  // contacts: Contact[] = [];
  // contact: Contact = {} as Contact;

  constructor(private http: HttpClient) { }

  getContacts() : Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl);
  }

  getFavorite(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/favorites`); // Use apiUrl aqui
  }

  save(contact: Contact) : Observable<Contact> { // Adicione o tipo de retorno
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  update(contact: Contact) : Observable<void> { // <-- MUDAR AQUI PARA 'void'
  return this.http.put<void>(`${this.apiUrl}/${contact.id}`, contact);
}
  // NOVO MÉTODO: updateFavorite
  // No backend, seu controller retorna ResponseEntity.noContent().build(),
  // então o tipo de retorno do Observable será 'void' ou 'any' se você não esperar dados.
  updateFavorite(contactId: number): Observable<void> {
    // A URL é ${this.apiUrl}/{id}/favorite
    // O backend não espera corpo para esta requisição, apenas o ID na URL
    return this.http.put<void>(`${this.apiUrl}/${contactId}/favorite`, {}); // Passar um corpo vazio {} é uma boa prática para PUTs sem corpo.
  }

  delete(id: number) : Observable<void> { // Adicione o tipo de retorno
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}