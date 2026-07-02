import { Routes } from "@angular/router";

export const PRODUCTS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import("./pages/products-list/products-list").then(c => c.ProductsList)
    },
    {
        path: ':id',
        loadComponent: () => import("./pages/product-details/product-details").then(c => c.ProductDetails)
    }
] 