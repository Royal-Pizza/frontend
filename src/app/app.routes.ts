import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { MenuComponent } from './components/menu/menu';
import { LogingComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { PizzaDetailComponent } from './components/pizza-detail/pizza-detail';
import { OrderComponent } from './components/order/order';

export const routes: Routes = [
  //{ path: '', component: HomeComponent }, // page d'accueil
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // redirection vers /home
  { path: 'home', component: HomeComponent }, // page d'accueil
  { path: 'menu', component: MenuComponent },
  { path: 'login', component: LogingComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'menu/:namePizza', component: PizzaDetailComponent }, // 👈 route pour le détail
  { path: 'basket', component: OrderComponent },
  { path: 'customers', redirectTo: 'home', pathMatch: 'full' },
  { path: 'ingredients', redirectTo: 'home', pathMatch: 'full' },
];