import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order/order-service';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../../services/httpRequest/auth/auth-service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, MatBadgeModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  countItems: number = 0;
  private orderService: OrderService;

  constructor(private router: Router, private authService: AuthService, orderService: OrderService) {
    this.orderService = orderService;
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;

      if (isLoggedIn) {
        // nouvel utilisateur → recharger panier
        this.orderService.refreshBasketFromServer();
      } else {
        // déconnexion → vider panier
        this.orderService.clearBasket();
      }

      const customer = localStorage.getItem('customer');
      this.isAdmin = customer ? JSON.parse(customer).isAdmin : false;
    });

    this.orderService.countItem$.subscribe(count => {
      this.countItems = count;
    });
  }


  logout() {
    this.authService.logout();
    console.log('Déconnecté !');
  }
}