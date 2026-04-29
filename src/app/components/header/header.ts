import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

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

  constructor(private router: Router, authService: AuthService) {
    this.authService = authService;
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
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
