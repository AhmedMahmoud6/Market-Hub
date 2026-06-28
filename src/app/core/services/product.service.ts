import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ProductCategory, ProductModel, ProductsResponse } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getProducts(limit = 10, skip = 0): Observable<ProductsResponse> {
    const params = new HttpParams().set("limit", limit).set("skip", skip);
    return this.http.get<ProductsResponse>(`${this.apiUrl}/products`, {params})
  }

  getProductById(id: number): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${this.apiUrl}/products/${id}`)
  }

  searchProducts(query: string, limit = 10, skip = 0): Observable<ProductsResponse> {
    const params = new HttpParams().set("q", query).set("limit", limit).set("skip", skip);
    return this.http.get<ProductsResponse>(`${this.apiUrl}/products/search`, {params})
  }

  getCategories(): Observable<ProductCategory> {
    return this.http.get<ProductCategory>(`${this.apiUrl}/products/categories`);
  }

  getCategoryList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/category-list`);
  }
}
