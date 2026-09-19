import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/anti-authGuard.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'menu',
    loadComponent: () => import('./features/catalog/menu/menu').then((m) => m.MenuComponent),
  },

  // --- ADMINISTRATION (À METTRE AVANT LE DÉTAIL) ---
  // On place 'menu/new' ICI pour qu'il soit détecté avant 'menu/:namePizza'
  {
    path: 'menu/new',
    loadComponent: () =>
      import('./features/admin/pizza-form/pizza-form').then((m) => m.PizzaFormComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'menu/:namePizza/edit',
    loadComponent: () =>
      import('./features/admin/pizza-form/pizza-form').then((m) => m.PizzaFormComponent),
    canActivate: [adminGuard],
  },

  // --- CATALOGUE DÉTAIL (PARAMÈTRE) ---
  // Cette route est "attrape-tout", elle doit être après les routes fixes
  {
    path: 'menu/:namePizza',
    loadComponent: () =>
      import('./features/catalog/pizza-detail/pizza-detail').then((m) => m.PizzaDetailComponent),
  },

  // --- ESPACE NON-CONNECTÉ ---
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup-setting/signup-setting').then(
        (m) => m.SignupAndSettingComponent,
      ),
    canActivate: [guestGuard],
  },

  // --- ESPACE CLIENT ---
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/auth/signup-setting/signup-setting').then(
        (m) => m.SignupAndSettingComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'settings/changePassword',
    loadComponent: () =>
      import('./features/account/update-password/update-password').then(
        (m) => m.UpdatePasswordComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'settings/walletRecharge',
    loadComponent: () =>
      import('./features/account/wallet-recharge/wallet-recharge').then(
        (m) => m.WalletRechargeComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'basket',
    loadComponent: () => import('./features/cart/order/order').then((m) => m.OrderComponent),
    canActivate: [authGuard],
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import('./features/account/invoices/invoices').then((m) => m.InvoicesComponent),
    canActivate: [authGuard],
  },

  // --- AUTRES ADMIN ---
  {
    path: 'ingredients',
    loadComponent: () =>
      import('./features/admin/ingredient/ingredient.component').then((m) => m.IngredientComponent),
    canActivate: [adminGuard],
  },

  { path: 'customers', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
