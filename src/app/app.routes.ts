import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { MenuComponent } from './components/menu/menu';
import { LogingComponent } from './components/login/login';
import { SignupAndSettingComponent } from './components/signup-setting/signup-setting';
import { PizzaDetailComponent } from './components/pizza-detail/pizza-detail';
import { OrderComponent } from './components/order/order';
import { InvoicesComponent } from './components/invoices/invoices';
import { UpdatePasswordComponent } from './components/update-password/update-password';
import { WalletRechargeComponent } from './components/wallet-recharge/wallet-recharge';
import { PizzaFormComponent } from './components/pizza-form/pizza-form';

export const routes: Routes = [
  //{ path: '', component: HomeComponent }, // page d'accueil
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // redirection vers /home
  { path: 'home', component: HomeComponent }, // page d'accueil
  { path: 'menu', component: MenuComponent },
  { path: 'menu/new', component: PizzaFormComponent },
  { path: 'menu/:namePizza', component: PizzaDetailComponent },
  { path: 'menu/:namePizza/edit', component: PizzaFormComponent },
  { path: 'login', component: LogingComponent },
  { path: 'signup', component: SignupAndSettingComponent },
  { path: 'settings', component: SignupAndSettingComponent },
  { path: 'settings/changePassword', component: UpdatePasswordComponent },
  { path: 'settings/walletRecharge', component: WalletRechargeComponent },
  { path: 'basket', component: OrderComponent },
  { path: 'invoices', component: InvoicesComponent },
  { path: 'customers', redirectTo: 'home', pathMatch: 'full' },
  { path: 'ingredients', redirectTo: 'home', pathMatch: 'full' },
];