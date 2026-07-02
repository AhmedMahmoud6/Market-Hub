import { computed, inject, Injectable, signal } from '@angular/core';
import { ProductModel } from '../../../core/models/product.model';
import { PaginationParams } from '../../../core/models/api-response.model';
import { ProductService } from '../../../core/services/product.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, Subject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {

  // ======================
  // 1. STATE (Signals)
  // ======================

  private products = signal<ProductModel[]>([]);
  private selectedProduct = signal<ProductModel | null>(null);

  private loading = signal(false);
  private error = signal<string | null>(null);

  private searchQuery = signal<string>('');
  private isSearchMode = signal(false);
  private searchSubject = new Subject<string>();

  private pagination = signal<PaginationParams>({
    limit: 10,
    skip: 0,
    total: 0
  });

  // ======================
  // 2. COMPUTED VALUES
  // ======================

  readonly allProducts = this.products.asReadonly();
  readonly currentProduct = this.selectedProduct.asReadonly();

  readonly isLoading = this.loading.asReadonly();
  readonly errorState = this.error.asReadonly();

  readonly query = this.searchQuery.asReadonly();

  readonly pageInfo = this.pagination.asReadonly();

  totalPages = computed(() => {
    const p = this.pagination();
    return Math.ceil(p.total / p.limit);
  });

  pages = computed(() => {
    return Array.from(
      {length: this.totalPages()
      },
      (_, i) => i + 1
    );
  }) 

  readonly hasProducts = computed(() => this.products().length > 0);

  // ======================
  // 3. Service
  // ======================

  private productService = inject(ProductService);

  constructor() {
    this.initSearchStream();
  }

  // ======================
  // 4. ACTIONS
  // ======================

  private initSearchStream(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        this.loading.set(true);
        this.error.set(null);

        if (!query.trim()) {
          this.isSearchMode.set(false);
          return this.productService.getProducts(this.pagination().limit, 0);
        }

        this.isSearchMode.set(true);
        return this.productService.searchProducts(query);
      }),
      catchError(() => {
        this.error.set('Search Failed');
        return of(null);
      })
    ).subscribe(res => {
      if (!res) return;

      this.products.set(res.products);
      this.loading.set(false);

      if ('total' in res) {
        this.pagination.update(p => ({
          ...p,
          total: res.total
        }))
      }
    })
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);
    this.isSearchMode.set(false);

    const {limit, skip} = this.pagination();
    
    this.productService.getProducts(limit, skip).pipe(
      finalize(() => this.loading.set(false)),
      catchError(err => {
        this.error.set('Failed to load products');
        return of(null);
      })
    ).subscribe(res => {
      if (!res) return;

      this.products.set(res.products);
      this.pagination.update(p => ({
        ...p,
        total: res.total
      }));
    })
  }

  loadProductsById(productId: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProductById(productId).pipe(
      finalize(() => this.loading.set(false)),
      catchError(err => {
        this.error.set('Failed to load product');
        return of(null);
      })
    ).subscribe(res => {
      if (!res) return;
      this.selectedProduct.set(res);
    });
  }

  searchProducts(query: string): void {
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }

  changePage(page: number): void {
    this.pagination.update(p => ({
      ...p,
      skip: (page - 1) * p.limit
    }));

    if (this.isSearchMode()) {
      this.searchSubject.next(this.searchQuery());
    } else {
      this.loadProducts();
    }
  }

  reset() {
    this.products.set([]);
    this.selectedProduct.set(null);
    this.error.set(null);
    this.searchQuery.set('');
    this.isSearchMode.set(false);
    this.pagination.set({
      limit: 10,
      skip: 0,
      total: 0
    });
  };
}
