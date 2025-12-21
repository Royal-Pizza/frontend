import { Component, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { LOGO_URL } from '../../utils/constantes';
import { AuthService } from '../../services/httpRequest/auth/auth-service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [] // Angular 20 : Plus besoin de CommonModule pour @if
})
export class HomeComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signaux en lecture seule provenant du service
  public readonly customer: Signal<Customer | null> = this.authService.currentUser;
  public readonly isLoggedIn: Signal<boolean> = this.authService.isLoggedIn;

  public readonly logoUrl: string = LOGO_URL;
}