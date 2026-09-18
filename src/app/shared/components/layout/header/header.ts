import { Component, inject, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { OrderService } from '../../../../core/services/order-service';
import { AuthService } from '../../../../core/auth/auth-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatBadgeModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);

  public readonly isLoggedIn = this.authService.isLoggedIn;
  public readonly isAdmin = this.authService.isAdmin;
  public readonly countItems = this.orderService.countItem;

  constructor() {

    effect(() => { // Lorsque le statut de connexion change
      if (this.isLoggedIn()) {
        this.orderService.refreshBasketFromServer();
      } else {
      }
    });
  }

  logout(): void {
    this.authService.logout();
    console.log('Déconnecté !');
  }
}