export interface ProductsResponse {
  products: ProductModel[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductModel {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  thumbnail: string;
  images: string[];
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductCategory {
  slug: string;
  name: string;
  url: string;
}

export interface AddProductRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  stock?: number;
  brand?: string;
  thumbnail?: string;
  images?: string[];
}

export type UpdateProductRequest = Partial<AddProductRequest>;

export interface DeletedProductModel extends ProductModel {
  isDeleted: boolean;
  deletedOn: string;
}