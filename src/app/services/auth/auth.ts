import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Customer } from '../../models/customer.model';
import { OrderService } from '../order/order-service';
import { AdaptedOrderLine } from '../../models/orderLine.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('authToken')); // BehaviorSubject pour émettre l'état initial
  isLoggedIn$ = this.loggedIn.asObservable();

  login(token: string, customer: Customer, basket: { [key: string]: AdaptedOrderLine[] }): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('customer', JSON.stringify(customer));
    this.loggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('customer');
    this.loggedIn.next(false);
  }

}
