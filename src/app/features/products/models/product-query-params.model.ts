export interface ProductListParams {
  limit: number;
  skip: number;
}

export interface ProductSearchParams extends ProductListParams {
  query: string;
}

export interface ProductCategoryParams extends ProductListParams {
  category: string;
}