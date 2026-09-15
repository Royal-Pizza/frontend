import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { delay, finalize, Subscription } from 'rxjs';

import { OrderService } from '../../services/order/order-service';
import { AdaptedOrderLine } from '../../models/orderLine.model';
import { LoaderService } from '../../services/tools/loader/loader-service';
import { PopupService } from '../../services/tools/popup/popup';
import { formatErrorMessage } from '../../utils/functions';
import { Customer } from '../../models/customer.model';
import { AuthService } from '../../services/httpRequest/auth/auth-service';
import { PurchaseService } from '../../services/httpRequest/purchase/purchase-service';

@Component({
  selector: 'app-order',
  imports: [CommonModule, MatIconModule],
  templateUrl: './order.html',
  styleUrls: ['./order.css']
})
export class OrderComponent implements OnInit, OnDestroy {

  orders: { [key: string]: AdaptedOrderLine[] } = {};
  customer: Customer | null = null;

  private basketSub?: Subscription;

  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private purchaseService = inject(PurchaseService);
  private loaderService = inject(LoaderService);
  private popupService = inject(PopupService);
  private router = inject(Router);

  ngOnInit(): void {
    const customerRaw = localStorage.getItem('customer');
    if (!customerRaw) {
      this.router.navigate(['/login']);
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.loaderService.show();
    this.authService.checkToken()
      .pipe(
        delay(5000),
        finalize(() => {
          this.loaderService.hide();
          //
        })
      )
      .subscribe({
        error: (err) => {
          this.popupService.showMessage(formatErrorMessage(err));
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      });
    this.customer = JSON.parse(customerRaw);

    this.basketSub = this.orderService.basket$.subscribe(basket => {
      this.orders = basket;
    });

    this.orderService.refreshBasketFromServer();
  }

  ngOnDestroy(): void {
    this.basketSub?.unsubscribe();
  }

  // Ajouter
  addToBasket(pizzaName: string, sizeName: string, price: number): void {
    this.orderService.addToBasket(pizzaName, sizeName, price);
  }

  // Retirer
  removeFromBasket(pizzaName: string, sizeName: string): void {
    this.orderService.removeFromBasket(pizzaName, sizeName);
  }

  // Vider
  clearBasket(): void {
    this.orderService.clearBasket();
  }

  // Panier vide
  isEmptyBasket(): boolean {
    return Object.keys(this.orders).length === 0;
  }

  // Total
  calculateTotal(): number {
    let total = 0;

    for (const pizza of Object.values(this.orders)) {
      for (const line of pizza) {
        total += line.price * line.quantity;
      }
    }

    return this.roundPrice(total);
  }

  roundPrice(price: number): number {
    return Math.round(price * 100) / 100;
  }

  // Commander
  sendOrder(): void {
    if (!this.customer) return;

    this.loaderService.show();

    this.purchaseService.purchasePizza(this.orders)
      .pipe(
        finalize(() => this.loaderService.hide())
      )
      .subscribe({
        next: (response) => {
          this.popupService.showMessage(response.message || 'Commande réussie !');

          localStorage.setItem('authToken', response.token);

          this.customer!.wallet -= this.calculateTotal();
          localStorage.setItem('customer', JSON.stringify(this.customer));

          this.clearBasket();
        },
        error: (error) => {
          this.popupService.showMessage(formatErrorMessage(error));
        }
      });
  }
}
