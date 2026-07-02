import { Routes } from "@angular/router";
import { authGuard } from "../../core/guards/auth-guard";

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        loadComponent: () => import("./pages/login/login").then(c => c.Login)
    }
]