import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CartModel, CartsResponse } from '../models/cart.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCarts(limit = 10, skip = 0): Observable<CartsResponse> {
    const params = new HttpParams().set("limit", limit).set("skip", skip);
    return this.http.get<CartsResponse>(`${this.apiUrl}/carts`, {params});
  }

  getCartById(id: number): Observable<CartModel> {
    return this.http.get<CartModel>(`${this.apiUrl}/carts/${id}`);
  }

  getCartsByUserId(userId: number): Observable<CartsResponse> {
    return this.http.get<CartsResponse>(`${this.apiUrl}/carts/user/${userId}`);
  }
}
