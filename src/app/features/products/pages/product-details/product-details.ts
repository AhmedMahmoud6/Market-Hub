import { Component, inject, OnInit } from '@angular/core';
import { ProductStore } from '../../store/product.store';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
  standalone: true
})
export class ProductDetails implements OnInit {
  productStore = inject(ProductStore);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productStore.loadProductsById(id);
  }
}
