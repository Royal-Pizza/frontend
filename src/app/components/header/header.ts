import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api/api';
import { OrderService } from '../../services/order/order-service';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatBadgeModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  countItems: number = 0;
  private apiService: ApiService;
  private orderService: OrderService;

  constructor(private router: Router, apiService: ApiService, orderService: OrderService) {
    this.apiService = apiService;
    this.orderService = orderService;
  }

  ngOnInit() {
    // Vérifie l'état de connexion au chargement
    this.apiService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      const customer = localStorage.getItem('customer');
      if (customer) {
        const customerObj = JSON.parse(customer);
        this.isAdmin = customerObj.isAdmin;
      }
    });
    this.orderService.countItem$.subscribe(count => {
      this.countItems = count;
    });
  }

  logout() {
    this.apiService.logoutCustomer();
    console.log('Déconnecté !');
  }
}