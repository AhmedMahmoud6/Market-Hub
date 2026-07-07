import { PaginationParams } from "../../../core/models/api-response.model";
import { ProductModel } from "../../../core/models/product.model";

export interface productState {
    products: ProductModel[];

    selectedProduct: ProductModel | null;

    loading: boolean;

    error: string | null;

    searchQuery: string;

    pagination: PaginationParams;

    filter: ProductFilters;
}

export interface ProductFilters {

  category: string | null;

  sortBy: string | null;

  order: 'asc' | 'desc' | null;

}