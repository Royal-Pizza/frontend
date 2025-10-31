import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order/order-service';
import { OrderLine } from '../../models/orderLine.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order',
  imports: [CommonModule, MatIconModule],
  templateUrl: './order.html',
  styleUrls: ['./order.css']
})
export class OrderComponent implements OnInit {
  orders: { [key: string]: OrderLine[] } = {};
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orders = this.orderService.getBasket();
  }

  addToBasket(pizzaName: string, sizeName: string, price: number): void {
    this.orderService.addToBasket(pizzaName, sizeName, price);
    this.orders = this.orderService.getBasket();
  }

  removeFromBasket(pizzaName: string, sizeName: string): void {
    this.orderService.removeFromBasket(pizzaName, sizeName);
    this.orders = this.orderService.getBasket();
  }

  calculateTotal(): number {
    let total = 0;
    for (const pizza of Object.values(this.orders)) {
      for (const line of pizza) {
        total += line.price * line.quantity;
      }
    }
    return Math.round(total * 100) / 100;
  }
}
