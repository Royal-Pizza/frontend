import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api/api';
import { Customer } from '../../models/customer.model';

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
  apiService: ApiService;

  constructor(apiService: ApiService, private router: Router) {
    this.apiService = apiService;

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

    this.apiService.loginCustomerWithInfo(this.email, this.password).subscribe({
      next: (customer: Customer) => {
        console.log('Connecté !', customer);

        // Redirection après succès
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erreur login :', err);

        // Si le backend renvoie un vrai objet JSON
        if (err.error && typeof err.error === 'object') {
          this.error = err.error.message;
        }
        // Si le backend renvoie une chaîne JSON (ex: '{"message":"Mot de passe incorrect"}')
        else if (typeof err.error === 'string') {

          try {
            const parsed = JSON.parse(err.error);
            this.error = parsed.message || err.error;
          } catch {
            this.error = err.error;
          }
        }
        // autre cas (erreur réseau, etc.)
        else {
          this.error = 'Erreur lors de la connexion';
        }
      }
    });
  }
}
