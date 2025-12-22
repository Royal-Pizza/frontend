import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { Pizza } from '../../../core/models/pizza.model';
import { OrderService } from '../../../core/services/order-service';
import { PizzaService } from '../pizza-service';
import { AuthService } from '../../../core/auth/auth-service';

@Component({
  selector: 'app-pizza-detail',
  standalone: true,
  imports: [CurrencyPipe, KeyValuePipe], // Plus besoin de CommonModule avec @if et @for
  templateUrl: './pizza-detail.html',
  styleUrls: ['./pizza-detail.css']
})
export class PizzaDetailComponent implements OnInit {
  public readonly pizza: WritableSignal<Pizza | null> = signal(null);

  private readonly authService = inject(AuthService);
  public readonly isConnected = this.authService.isLoggedIn;

  private readonly route = inject(ActivatedRoute);
  private readonly pizzaService = inject(PizzaService);
  private readonly orderService = inject(OrderService);

  ngOnInit(): void {
    const namePizza = this.route.snapshot.paramMap.get('namePizza');

    if (namePizza) {
      this.pizzaService.getById(namePizza).subscribe({
        next: (data) => this.pizza.set(data),
        error: (err) => console.error('Erreur chargement pizza', err)
      });
    }
  }

  addToBasket(pizzaName: string, sizeName: string, price: number): void {
    this.orderService.addToBasket(pizzaName, sizeName, price);
  }
}