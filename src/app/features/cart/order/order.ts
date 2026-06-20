import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { OrderService } from '../../../core/services/order-service';
import { LoaderService } from '../../../shared/services/loader-service';
import { PopupService } from '../../../shared/services/popup';
import { PurchaseService } from '../../../core/services/purchase-service';
import { formatErrorMessage } from '../../../shared/utils/functions';
import { AuthService } from '../../../core/auth/auth-service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [MatIconModule, DecimalPipe, KeyValuePipe],
  templateUrl: './order.html',
  styleUrls: ['./order.css']
})
export class OrderComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);
  private readonly purchaseService = inject(PurchaseService);
  private readonly loaderService = inject(LoaderService);
  private readonly popupService = inject(PopupService);
  private readonly router = inject(Router);

  public readonly orders = this.orderService.basket;
  public readonly totalAmount = this.orderService.totalPrice;
  public readonly customer = this.authService.currentUser;

  ngOnInit(): void {
    this.orderService.refreshBasketFromServer();
  }

  addToBasket(pizzaName: string, sizeName: string, price: number): void {
    this.orderService.addToBasket(pizzaName, sizeName, price);
  }

  removeFromBasket(pizzaName: string, sizeName: string): void {
    this.orderService.removeFromBasket(pizzaName, sizeName);
  }

  clearBasket(): void {
    this.orderService.clearBasket();
  }

  sendOrder(): void {
    const user = this.customer();
    if (!user) return;

    this.loaderService.show();
    this.purchaseService.purchasePizza(this.orders())
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: (response) => {
          this.popupService.showMessage(response.message || 'Commande réussie !');
          this.authService.updateLocalCusomerDataFromToken(response.token);
          this.clearBasket();
        },
        error: (error) => this.popupService.showMessage(formatErrorMessage(error))
      });
  }
}