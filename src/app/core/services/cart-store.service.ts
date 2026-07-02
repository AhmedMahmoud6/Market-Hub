import { computed, Injectable, signal } from '@angular/core';
import { LocalCartItem } from '../models/cart.model';
import { ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartStoreService {
  private cartItemsSignal = signal<LocalCartItem[]>([]);

  cartItems = this.cartItemsSignal.asReadonly();

  totalItems = computed(() => {
    // this calculates the total items in the cart by their quantity
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  });

  totalPrice = computed(() => {
    return this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0);
  });

  addToCart(product: ProductModel): void {
    this.cartItemsSignal.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);

      if (existingItem) {
        return items.map(item => 
          item.product.id === product.id
          ? {...item, quantity: item.quantity + 1}
          : item
        )
      }

      return [
        ...items,
        {
          product,
          quantity: 1
        }
      ];
    });
  };

  removeFromCart(productId: number): void {
    this.cartItemsSignal.update(items => items.filter(item => item.product.id !== productId));
  }

  increaseQuantity(productId: number): void {
    this.cartItemsSignal.update(items => 
      items.map(
        item => 
          item.product.id === productId 
        ? { ...item, quantity: item.quantity + 1 }
        : item
      )
    );
  };

  decreaseQuantity(productId: number): void {
    this.cartItemsSignal.update(items => 
      items.map(
        item => item.product.id === productId
        ? { ...item, quantity: item.quantity - 1 }
        : item
      ).filter(item => item.quantity > 0)
    );
  };

  clearCart(): void {
    this.cartItemsSignal.set([]);
  }
}
