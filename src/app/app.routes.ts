import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { MenuComponent } from './components/menu/menu';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // page d'accueil
  { path: 'menu', component: MenuComponent },              // page menu avec pizzas
];
