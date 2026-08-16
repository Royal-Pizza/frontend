import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { ApiService } from '../../services/api/api';
import { OrderService } from '../../services/order/order-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  private authService: AuthService;
  private apiService: ApiService;
  private orderService: OrderService;

  constructor(private router: Router, authService: AuthService, apiService: ApiService, orderService: OrderService) {
    this.authService = authService;
    this.apiService = apiService;
    this.orderService = orderService;
  }

  ngOnInit() {
    // Vérifie l'état de connexion au chargement
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      const customer = localStorage.getItem('customer');
      if (customer) {
        const customerObj = JSON.parse(customer);
        this.isAdmin = customerObj.isAdmin;
      }
    });
  }

  logout() {
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
  }
}