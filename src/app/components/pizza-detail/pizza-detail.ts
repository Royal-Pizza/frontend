import { Component, OnInit } from '@angular/core';
import { Pizza } from '../../models/pizza.model';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api/api';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order/order-service';

@Component({
  selector: 'app-pizza-detail',
  imports: [CommonModule],
  templateUrl: './pizza-detail.html',
  styleUrls: ['./pizza-detail.css']
})
export class PizzaDetailComponent implements OnInit {
  pizza?: Pizza;
  isConnected: boolean = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private orderService: OrderService) {}

  addToBasket(pizzaName: string, sizeName: string, price: number): void {
    this.orderService.addToBasket(pizzaName, sizeName, price);
  }

  ngOnInit(): void {
    this.isConnected = !!localStorage.getItem('customer');
    const namePizza = this.route.snapshot.paramMap.get('namePizza');
    console.log("namePizza = " + namePizza);
    this.apiService.getPizzaById(namePizza).subscribe({
      next: (data) => this.pizza = data,
      error: (err) => console.error('Erreur chargement pizza', err)
    });
  }
}
