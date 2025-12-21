import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { MenuComponent } from './components/menu/menu';
import { LoginComponent } from './components/login/login';
import { SignupAndSettingComponent } from './components/form/signup-setting/signup-setting';
import { PizzaDetailComponent } from './components/pizza-detail/pizza-detail';
import { OrderComponent } from './components/order/order';
import { InvoicesComponent } from './components/invoices/invoices';
import { UpdatePasswordComponent } from './components/form/update-password/update-password';
import { WalletRechargeComponent } from './components/form/wallet-recharge/wallet-recharge';
import { PizzaFormComponent } from './components/form/pizza-form/pizza-form';
import { IngredientComponent } from './components/ingredient/ingredient.component';

export const routes: Routes = [
  //{ path: '', component: HomeComponent }, // page d'accueil
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // redirection vers /home
  { path: 'home', component: HomeComponent }, // page d'accueil
  { path: 'menu', component: MenuComponent },
  { path: 'menu/new', component: PizzaFormComponent },
  { path: 'menu/:namePizza', component: PizzaDetailComponent },
  { path: 'menu/:namePizza/edit', component: PizzaFormComponent },
  { path: 'ingredients', component: IngredientComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupAndSettingComponent },
  { path: 'settings', component: SignupAndSettingComponent },
  { path: 'settings/changePassword', component: UpdatePasswordComponent },
  { path: 'settings/walletRecharge', component: WalletRechargeComponent },
  { path: 'basket', component: OrderComponent },
  { path: 'invoices', component: InvoicesComponent },
  { path: 'customers', redirectTo: 'home', pathMatch: 'full' },
  { path: 'ingredients', redirectTo: 'home', pathMatch: 'full' },
];