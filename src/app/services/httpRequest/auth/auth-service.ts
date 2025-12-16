import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Customer } from '../../../models/customer.model';
import { environment } from '../../../../environments/environment';
import { getHeaders } from '../../../utils/functions';
import { OrderService } from '../../order/order-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn$ = new BehaviorSubject<boolean>(
    !!localStorage.getItem('authToken')
  );

  isLoggedIn$ = this.loggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router, private orderService: OrderService) {}

  login(email: string, password: string): Observable<Customer> {
    return this.http.post<any>(`${environment.backendBaseUrl}/customers/login`, {
      email: email.trim().toLowerCase(),
      password
    }).pipe(
      map(dico => {
        const payload = JSON.parse(atob(dico.token.split('.')[1]));
        const customer: Customer = {
          idCustomer: payload.id,
          firstName: payload.firstName,
          lastName: payload.lastName,
          emailAddress: payload.emailAddress,
          wallet: payload.wallet,
          isAdmin: payload.isAdmin
        };
        localStorage.setItem('authToken', dico.token);
        localStorage.setItem('customer', JSON.stringify(customer));
        this.loggedIn$.next(true);
        return customer;
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.loggedIn$.next(false);
    this.router.navigate(['/home']);
  }

  checkToken(): Observable<any> {
    return this.http.get(`${environment.backendBaseUrl}/customers/checkToken`, 
      { headers: getHeaders() }
    );
  }
}
