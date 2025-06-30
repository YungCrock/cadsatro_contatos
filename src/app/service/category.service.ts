import { Injectable } from '@angular/core';
import { Category } from '../interfaces/Category';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiUrl = "https://enzoaguiar.duckdns.org/categories";

  categories: Category[] = []

  constructor(private http: HttpClient) { }

  getCategories() : Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
}
