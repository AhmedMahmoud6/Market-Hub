export interface PaginationParams {
  limit: number;
  skip: number;
}

export interface SearchParams extends PaginationParams {
  q: string;
}