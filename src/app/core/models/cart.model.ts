import { ProductModel } from "./product.model";

export interface CartsResponse {
  carts: CartModel[];
  total: number;
  skip: number;
  limit: number;
}

export interface CartModel {
  id: number;
  products: CartProductModel[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartProductModel {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface LocalCartItem {
  product: ProductModel;
  quantity: number;
}