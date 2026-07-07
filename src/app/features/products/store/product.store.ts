import { computed, inject, Injectable, signal } from '@angular/core';
import { ProductModel, ProductsResponse } from '../../../core/models/product.model';
import { PaginationParams } from '../../../core/models/api-response.model';
import { ProductService } from '../../../core/services/product.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, OperatorFunction, pipe, Subject, switchMap } from 'rxjs';
import { productState } from './product.state';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {

  // ======================
  // 1. STATE (Signals)
  // ======================

  private state = signal<productState>({
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
    searchQuery: '',
    pagination: {
      limit: 10,
      skip: 0,
      total: 0
    }
  });

  // private products = signal<ProductModel[]>([]);
  // private selectedProduct = signal<ProductModel | null>(null);

  // private loading = signal(false);
  // private error = signal<string | null>(null);

  // private searchQuery = signal<string>('');
  private searchSubject = new Subject<string>();

  // private pagination = signal<PaginationParams>({
  //   limit: 10,
  //   skip: 0,
  //   total: 0
  // });

  // ======================
  // 2. COMPUTED VALUES
  // ======================

  readonly allProducts = computed(() => this.state().products);
  readonly currentProduct = computed(() => this.state().selectedProduct) ;

  readonly isLoading = computed(() => this.state().loading);
  readonly errorState = computed(() => this.state().error);

  readonly query = computed(() => this.state().searchQuery);
  readonly isSearchMode = computed(() => !!this.state().searchQuery.trim());

  readonly pageInfo = computed(() => this.state().pagination);

  totalPages = computed(() => {
    const p = this.pageInfo();
    return Math.ceil(p.total / p.limit);
  });

  pages = computed(() => {
    return Array.from(
      {length: this.totalPages()
      },
      (_, i) => i + 1
    );
  }) 

  readonly hasProducts = computed(() => this.state().products.length > 0);

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

  private updateProducts(res: ProductsResponse) {

    this.state.update(state => ({
      ...state,
      products: res.products,
      pagination: {
        ...state.pagination,
        total: res.total
      }
    }));
  }

  private setLoading(loading: boolean) {
    this.state.update(state => ({
      ...state,
      loading
    }));
  }

  private setError(error: string | null) {
    this.state.update(state => ({
      ...state,
      error
    }));
  }

  private handleRequest<T>(errorMessage: string):OperatorFunction<T, T | null> {
    return pipe (
      finalize(() => this.setLoading(false)),
      catchError(() => {
        this.setError(errorMessage);
        return of(null);
      })
    )
  }
  
  private initSearchStream(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {

        this.setLoading(true);
        this.setError(null);

        const {limit, skip} = this.pageInfo();

        if (!query.trim()) {
          return this.productService.getProducts(limit, skip);
        }

        return this.productService.searchProducts(query, limit, skip);
      }),
      this.handleRequest("Search Failed")
    ).subscribe(res => {
      if (!res) return;

      this.updateProducts(res);
      
    })
  }

  searchWithPagination(): void {
    this.setLoading(true);

    const {limit, skip} = this.pageInfo();

    this.productService.searchProducts(this.query(), limit, skip).pipe(
      this.handleRequest("Failed to load products")
    ).subscribe(res => {
      if (!res) return;

      this.updateProducts(res);
    })
  }

  loadProducts(): void {
    this.setLoading(true);
    this.setError(null);

    const {limit, skip} = this.pageInfo();
    
    this.productService.getProducts(limit, skip).pipe(
      this.handleRequest("Failed to load products")
    ).subscribe(res => {
      if (!res) return;

      this.updateProducts(res);
    })
  }

  loadProductsById(productId: number): void {
    this.setLoading(true);
    this.setError(null);

    this.productService.getProductById(productId).pipe(
      this.handleRequest("Failed to load products")
    ).subscribe(res => {
      if (!res) return;
      this.state.update(state => ({
        ...state,
        selectedProduct: res
      }))
    });
  }

  searchProducts(query: string): void {
    if (!this.query().trim() && query.trim()) {
      this.state.update(state => ({
        ...state,
        pagination: {
          ...state.pagination,
          skip: 0
        }
      }))
    }

    this.state.update(state => ({
      ...state,
      searchQuery: query
    }));
    this.searchSubject.next(query);
  }

  changePage(page: number): void {
    this.state.update(state => ({
      ...state,
      pagination: {
        ...state.pagination,
        skip: (page - 1) * state.pagination.limit
      }
    }))

    if (this.isSearchMode()) {
      this.searchWithPagination();
    } else {
      this.loadProducts();
    }
  }

  reset() {
    this.state.set(({
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
    searchQuery: '',
    pagination: {
      limit: 10,
      skip: 0,
      total: 0
    }
  }));
  
  }
}
