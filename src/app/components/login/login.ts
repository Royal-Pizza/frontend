import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Customer } from '../../models/customer.model';
import { formatErrorMessage } from '../../utils/functions';
import { AuthService } from '../../services/httpRequest/auth/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LogingComponent {
  email: string = '';
  password: string = '';
  submitted: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {

    // Redirection si déjà connecté
    if (localStorage.getItem('authToken')) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Veuillez renseigner tous les champs';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (customer: Customer) => {
        console.log('Connecté !', customer);

        // Redirection après succès
        this.router.navigate(['/home']);
      },
      error: (err) => {
        err = formatErrorMessage(err);
        this.error = err || 'Erreur lors de la connexion';
      }
    });
  }
}
