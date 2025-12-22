import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Customer } from '../../../core/models/customer.model';
import { formatErrorMessage } from '../../../shared/utils/functions';
import { AuthService } from '../../../core/auth/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule], // Plus besoin de CommonModule pour @if
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  public readonly email: WritableSignal<string> = signal('');
  public readonly password: WritableSignal<string> = signal('');
  public readonly submitted: WritableSignal<boolean> = signal(false);
  public readonly error: WritableSignal<string> = signal('');

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    // Redirection si déjà connecté
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    this.submitted.set(true);
    this.error.set('');

    const emailVal = this.email();
    const passwordVal = this.password();

    if (!emailVal || !passwordVal) {
      this.error.set('Veuillez renseigner tous les champs');
      return;
    }

    this.authService.login(emailVal, passwordVal).subscribe({
      next: (customer: Customer) => {
        console.log('Connecté !', customer);

        // Redirection après succès
        this.router.navigate(['/home']);
      },
      error: (err) => {
        const message = formatErrorMessage(err);
        this.error.set(message || 'Erreur lors de la connexion');
      }
    });
  }
}