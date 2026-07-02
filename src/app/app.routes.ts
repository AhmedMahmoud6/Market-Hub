import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';

export const routes: Routes = [
    ...AUTH_ROUTES,

    {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path: "**",
        redirectTo: "login"
    },
    {
        path: "products",
        loadChildren: () => import("./features/products/products.routes").then(r => r.PRODUCTS_ROUTES)
    }
];
