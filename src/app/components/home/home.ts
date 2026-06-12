import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from '../../models/customer.model';
import { CommonModule } from '@angular/common';
import { LOGO_URL } from '../../tools/constantes';
import { ApiService } from '../../services/api/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {
  customer: Customer | null = null;
  logoUrl = LOGO_URL;

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        const customerData = localStorage.getItem('customer');
        if (customerData) {
          this.customer = JSON.parse(customerData);
        }
      } else {
        this.customer = null;
      }
    });
  }
}

  