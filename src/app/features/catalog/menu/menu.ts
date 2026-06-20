import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth-service';
import { PizzaService } from '../pizza-service';
import { LoaderService } from '../../../shared/services/loader-service';
import { PopupService } from '../../../shared/services/popup';
import { OrderService } from '../../../core/services/order-service';
import { Pizza, UpdatedPizza } from '../../../core/models/pizza.model';
import { formatErrorMessage } from '../../../shared/utils/functions';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CurrencyPipe],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit {
  // --- SERVICES ---
  private readonly authService = inject(AuthService);
  private readonly pizzaService = inject(PizzaService);
  private readonly loaderService = inject(LoaderService);
  private readonly popupService = inject(PopupService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  // --- SIGNALS ---
  public readonly pizzas = signal<Pizza[]>([]);
  public readonly isConnected = this.authService.isLoggedIn;
  public readonly isAdmin = this.authService.isAdmin;

  ngOnInit(): void {
    this.loadPizzas();
  }

  loadPizzas(): void {
    this.loaderService.show();

    const request$ = this.isAdmin()
      ? this.pizzaService.getAll()
      : this.pizzaService.getAvailable();

    request$
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: (data) => this.pizzas.set(data),
        error: (err) => {
          this.popupService.showMessage('Erreur chargement pizzas: ' + formatErrorMessage(err));
        }
      });
  }

  toggleAvailability(pizza: Pizza): void {
    const updatedPizza: UpdatedPizza = {
      ...pizza, // On spread l'objet pour plus de simplicité
      pricePizza: pizza.pricePizza['normale'], // On adapte au format attendu par ton API Update
      available: !pizza.available
    };

    this.pizzaService.update(updatedPizza).subscribe({
      next: () => {
        // MISE À JOUR LOCALE (Optimistic UI)
        // On évite un appel réseau getAll() complet en modifiant juste l'item dans le signal
        this.pizzas.update(list =>
          list.map(p => p.idPizza === pizza.idPizza ? { ...p, available: !p.available } : p)
        );
        this.orderService.refreshBasketFromServer();
      },
      error: (err) => this.popupService.showMessage(formatErrorMessage(err))
    });
  }

  goToPizza(namePizza: string): void {
    this.router.navigate(['/menu', namePizza]);
  }

  goToEditPizza(namePizza: string): void {
    this.router.navigate(['/menu', namePizza, 'edit']);
  }

  goToNewPizza(): void {
    this.router.navigate(['/menu', 'new']);
  }
}