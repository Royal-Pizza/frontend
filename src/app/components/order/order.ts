import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order/order-service';
import { OrderLine } from '../../models/orderLine.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api/api';
import { formatErrorMessage } from '../../tools/functions';
import { PopupComponent } from '../popup/popup';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-order',
  imports: [CommonModule, MatIconModule, PopupComponent
  ],
  templateUrl: './order.html',
  styleUrls: ['./order.css']
})
export class OrderComponent implements OnInit {

  orders: { [key: string]: OrderLine[] } = {};
  popupMessage: string = '';
  popupVisible: boolean = false;

  constructor(private orderService: OrderService, private apiService: ApiService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.orders = this.orderService.getBasket();
  }

  addToBasket(pizzaName: string, sizeName: string, price: number): void {
    this.orderService.addToBasket(pizzaName, sizeName, price);
    this.orders = this.orderService.getBasket();
  }

  removeFromBasket(pizzaName: string, sizeName: string): void {
    this.orderService.removeFromBasket(pizzaName, sizeName);
    this.orders = this.orderService.getBasket();
  }

  clearBasket(): void {
    this.orderService.clearBasket();
    this.orders = this.orderService.getBasket();
  }

  isEmptyBasket(): boolean {
    return Object.keys(this.orders).length === 0;
  }

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

  sendOrder(): void {
    this.apiService.purchasePizza(this.orders).subscribe({
      next: (response) => {
        console.log('Commande réussie :', response);
        this.popupMessage = response.message || 'Commande réussie !';
        localStorage.setItem('authToken', response.token);
        this.clearBasket();
      },
      error: (error) => {
        this.popupMessage = formatErrorMessage(error);
        console.error('Erreur lors de la commande :', error);
        console.log('Popup message set to:', this.popupMessage);
        this.popupVisible = true;
        if (this.popupMessage?.includes('Le token a expiré') || this.popupMessage?.includes('Token invalide ou corrompu')) {
          // attente de 5 secondes avant de rediriger
          setTimeout(() => {
            this.apiService.logoutCustomer().subscribe({
              next: () => {
                console.log('Basket saved.');
              },
              error: (err) => {
                console.error('Erreur lors du logout :', err);
              },
            });
            console.log('Déconnecté !');
            this.router.navigate(['/home']);
          }, 5000);
        }
      }

    });
    this.popupVisible = true;

  }
}
