export interface ProductListParams {

    limit: number;
    skip: number;

    sortBy?: string | null;
    order?: 'asc' | 'desc' | null;
}

export interface ProductSearchParams extends ProductListParams {
  query: string;
}

export interface ProductCategoryParams extends ProductListParams {
  category: string;
}