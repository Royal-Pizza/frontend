import { Component, inject, OnInit } from '@angular/core';
import { Pizza } from '../../models/pizza.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order/order-service';
import { PizzaService } from '../../services/httpRequest/pizza/pizza-service';

@Component({
  selector: 'app-pizza-detail',
  imports: [CommonModule],
  templateUrl: './pizza-detail.html',
  styleUrls: ['./pizza-detail.css']
})
export class PizzaDetailComponent implements OnInit {
  pizza?: Pizza;
  isConnected: boolean = false;

    private route = inject(ActivatedRoute);
    private pizzaService = inject(PizzaService);
    private orderService = inject(OrderService);

  addToBasket(pizzaName: string, sizeName: string, price: number): void {
    this.orderService.addToBasket(pizzaName, sizeName, price);
  }

  ngOnInit(): void {
    this.isConnected = !!localStorage.getItem('customer');
    const namePizza = this.route.snapshot.paramMap.get('namePizza')!;
    console.log("namePizza = " + namePizza);
    this.pizzaService.getById(namePizza).subscribe({
      next: (data) => this.pizza = data,
      error: (err) => console.error('Erreur chargement pizza', err)
    });
  }
}
