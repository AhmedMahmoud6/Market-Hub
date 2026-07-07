import { Component, inject, OnInit } from '@angular/core';
import { ProductStore } from '../../store/product.store';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-list',
  imports: [RouterLink],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
  standalone: true
})
export class ProductsList implements OnInit {
  productStore = inject(ProductStore);

  ngOnInit(): void {
    if (this.productStore.isSearchMode()) {
      this.productStore.searchWithPagination();
    } else {
      this.productStore.loadProducts();
    }
  }

  goToPage(page: number) {
    this.productStore.changePage(page);
  }

  onSearch(query: string) {
    this.productStore.searchProducts(query);
  }
}
