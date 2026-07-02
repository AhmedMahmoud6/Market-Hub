import { Routes } from "@angular/router";
import { authGuard } from "../../core/guards/auth-guard";

export const PRODUCTS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import("./pages/products-list/products-list").then(c => c.ProductsList),
        canActivate: [authGuard]
    },
    {
        path: ':id',
        loadComponent: () => import("./pages/product-details/product-details").then(c => c.ProductDetails),
        canActivate: [authGuard]
    }
] 