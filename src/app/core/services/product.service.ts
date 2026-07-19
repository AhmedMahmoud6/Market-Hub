import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AddProductRequest, DeletedProductModel, ProductCategory, ProductModel, ProductsResponse, UpdateProductRequest } from '../models/product.model';
import { Observable } from 'rxjs';
import { ProductCategoryParams, ProductListParams, ProductSearchParams } from '../../features/products/models/product-query-params.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getProducts(params: ProductListParams): Observable<ProductsResponse> {
    // const params = new HttpParams().set("limit", limit).set("skip", skip);
    return this.http.get<ProductsResponse>(`${this.apiUrl}/products`, {params: {
      limit: params.limit,
      skip: params.skip,
      ...(params.sortBy && {
          sortBy: params.sortBy
       }),
      ...(params.order && {
          order: params.order
       })
    }})
  }

  getProductById(id: number): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${this.apiUrl}/products/${id}`)
  }

  searchProducts(params: ProductSearchParams): Observable<ProductsResponse> {
    // const params = new HttpParams().set("q", query).set("limit", limit).set("skip", skip);
    return this.http.get<ProductsResponse>(`${this.apiUrl}/products/search`, {params: {
      q: params.query,
      limit: params.limit,
      skip: params.skip,
      ...(params.sortBy && {
          sortBy: params.sortBy
       }),
      ...(params.order && {
          order: params.order
       })
    }})
  }

  getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.apiUrl}/products/categories`);
  }

  getCategoryList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/category-list`);
  }

  getProductsByCategory(params: ProductCategoryParams): Observable<ProductsResponse> {
    // const params = new HttpParams().set("limit", limit).set("skip", skip);
    return this.http.get<ProductsResponse>(`${this.apiUrl}/products/category/${params.category}`, {params: {
      limit: params.limit,
      skip: params.skip,
      ...(params.sortBy && {
          sortBy: params.sortBy
       }),
      ...(params.order && {
          order: params.order
       })
    }})
  }

  addProduct(data: AddProductRequest): Observable<ProductModel> {
    return this.http.post<ProductModel>(`${this.apiUrl}/products/add`, data);
  }

  updateProduct(id: number, data: UpdateProductRequest): Observable<ProductModel> {
    return this.http.put<ProductModel>(`${this.apiUrl}/products/${id}`, data);
  }

  deleteProduct(id: number): Observable<DeletedProductModel> {
    return this.http.delete<DeletedProductModel>(`${this.apiUrl}/products/${id}`);
  }
}
