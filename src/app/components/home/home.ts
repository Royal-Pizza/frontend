import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from '../../models/customer.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {

  customer: Customer | null = null;
  private authService: AuthService;

  constructor(private router: Router, authService: AuthService) {
    this.authService = authService;
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        const customerData = localStorage.getItem('customer');
        if (customerData) {
          this.customer = JSON.parse(customerData); // convertir JSON en objet
        }
      } else {
        this.customer = null;
      }
    });
  }
}
  