import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-product-filter',
  imports: [],
  templateUrl: './product-filter.html',
  styleUrl: './product-filter.scss',
})
export class ProductFilter {
  @Output()
  categoryChange = new EventEmitter<string | null>();

  @Output()
  sortChange = new EventEmitter
  <{
    sortBy: string | null,
    order: 'asc' | 'desc' | null
  }>();

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    this.categoryChange.emit(value || null);
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    if (value === "price-asc") {
      this.sortChange.emit({
        sortBy: 'price',
        order: 'asc',
      });
    }

    if (value === "price-desc") {
      this.sortChange.emit({
        sortBy: 'price',
        order: 'desc'
      })
    }

    if (value === "none") {
      this.sortChange.emit({
        sortBy: null,
        order: null
      })
    }
  }
}
