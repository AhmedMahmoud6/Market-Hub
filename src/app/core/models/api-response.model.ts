export interface PaginationParams {
  limit: number;
  skip: number;
  total: number
}

export interface SearchParams extends PaginationParams {
  q: string;
}