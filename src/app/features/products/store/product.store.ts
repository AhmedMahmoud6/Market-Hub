import { computed, inject, Injectable, signal } from '@angular/core';
import { ProductModel, ProductsResponse } from '../../../core/models/product.model';
import { PaginationParams } from '../../../core/models/api-response.model';
import { ProductService } from '../../../core/services/product.service';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, Observable, of, OperatorFunction, pipe, Subject, switchMap, tap } from 'rxjs';
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
    filter: {
      category: null,
      order: null,
      sortBy: null
    },
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

  readonly filters = computed(() =>
  this.state().filter
);

  readonly currentPage = computed(() => {
    return this.state().pagination.skip / this.state().pagination.limit + 1;
  })

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

  // abstraction for any request 
  /*
    START
    |
    loading = true
    |
    error = null
    |
    API CALL
    |
    success → update data
    |
    error → set error
    |
    finally → loading=false
  */
  private executeRequest<T>(
    request$: Observable<T>,
    onSuccess: (response: T) => void,
    errorMessage: string
  ) {
    this.setLoading(true);
    this.setError(null);

    request$.pipe(
      this.handleRequest(errorMessage)
    ).subscribe(res => {
      if (!res) return;

      onSuccess(res);
    });

  }

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

      // switchMap(query => {

      //   const {limit, skip} = this.pageInfo();

      //   // if the search is empty
      //   if (!query.trim()) {

      //     const {category} = this.filters();

      //     // if the search is empty and we're filtering products with category 
      //     if (category) return this.productService.getProductsByCategory({category, limit, skip});
          
      //     // if the search is empty and there's no filtering
      //     return this.productService.getProducts({limit, skip});
      //   }

      //   // if there's a search
      //   return this.productService.searchProducts({query, limit, skip});
      // }),
      // this.handleRequest("Search Failed")
    ).subscribe(() => {
      // singe source of truth
      this.loadProducts();
    })
  }

  filterProducts() {}

  // searchWithPagination(): void {
  //   this.setLoading(true);

  //   const {limit, skip} = this.pageInfo();

  //   this.executeRequest(
  //     this.productService.searchProducts({query: this.query(), limit, skip}),
  //     res => this.updateProducts(res),
  //     "Failed to load products"
  //   )
  // }

  // single source of truth for selecting which mode are we in for loading products
  loadProducts(): void {

    const {limit, skip} = this.pageInfo();
    const {
      category,
      sortBy,
      order
    } = this.filters();
    
    // if there's a search then it's priority is higher than filtering 
    if (this.isSearchMode()) {
      this.executeRequest(
        this.productService.searchProducts({query: this.query(), limit, skip, order, sortBy}),
        res => this.updateProducts(res),
        "Search Failed"
      );

      return;
    }

    // filter products by category
    if (category) {
      this.executeRequest(
        this.productService.getProductsByCategory({category, limit, skip, order, sortBy}),
        res => this.updateProducts(res),
        "Failed to load products"
      )

      return;
    }

    this.executeRequest(
      this.productService.getProducts({limit, skip, order, sortBy}),
      res => this.updateProducts(res),
      "Failed to load products"
    );
  }

  changeSort(
    sortBy: string | null,
    order: 'asc' | 'desc' | null
  ) {

    this.state.update(state => ({
      ...state,

      filter: {
        ...state.filter,
        sortBy,
        order
      },

      pagination:{
        ...state.pagination,
        skip:0
      }

    }));

    this.loadProducts();
  }

  loadProductsById(productId: number): void {

    this.executeRequest(
      this.productService.getProductById(productId),

      product => {
        this.state.update(state => ({
          ...state,
          selectedProduct: product
        }))
      },

      "Failed to load products"
    )
  }

  searchProducts(query: string): void {
    this.state.update(state => ({
      ...state,
      searchQuery: query,
      pagination: {
        ...state.pagination,
        skip: 0
      }
    }))
    
    this.searchSubject.next(query);
  }

  changeCategory(category: string | null) {
    this.state.update(state => ({
      ...state,
      filter: {
        ...state.filter,
        category
      },

      pagination: {
        ...state.pagination,
        skip: 0
      }
    }))

    this.loadProducts();
  }

  changePage(page: number): void {

    if (page === this.currentPage()) return;
    
    this.state.update(state => ({
      ...state,
      pagination: {
        ...state.pagination,
        skip: (page - 1) * state.pagination.limit
      }
    }))

    this.loadProducts();
    
  }

  clearFilters(){
    this.state.update(state => ({
      ...state,

      searchQuery:'',

      filter:{
        category:null,
        sortBy:null,
        order:null
      },

      pagination:{
        ...state.pagination,
        skip:0
      }
    }));

    this.loadProducts();

  }

  reset() {
    this.state.set({
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
    searchQuery: '',
    filter: {
      category: null,
      order: null,
      sortBy: null
    },
    pagination: {
      limit: 10,
      skip: 0,
      total: 0
    }
  });
  
  }
}
