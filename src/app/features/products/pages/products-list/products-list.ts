import { Component, inject, OnInit } from '@angular/core';
import { ProductStore } from '../../store/product.store';
import { RouterLink } from "@angular/router";
import { ProductFilter } from "../../components/product-filter/product-filter";

@Component({
  selector: 'app-products-list',
  imports: [RouterLink, ProductFilter],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
  standalone: true
})
export class ProductsList implements OnInit {
  productStore = inject(ProductStore);

  ngOnInit(): void {
    this.productStore.loadProducts();
  }

  goToPage(page: number) {
    this.productStore.changePage(page);
  }

  onSearch(query: string) {
    this.productStore.searchProducts(query);
  }

  changeCategory(category: string | null) {
    this.productStore.changeCategory(category);
  }

  changeSort(event: {
    sortBy: string | null,
    order: 'asc' | 'desc' | null
  }) {
    this.productStore.changeSort(event.sortBy, event.order);
  }
}
