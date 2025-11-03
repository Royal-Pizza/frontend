import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pizza } from '../../models/pizza.model';
import { Customer, NewCustomer, LoginDTO } from '../../models/customer.model';
import { toTitleCase } from '../../tools/functions';
import { AuthService } from '../auth/auth';
import { OrderLine } from '../../models/orderLine.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private authService: AuthService;
  constructor(private http: HttpClient, authService: AuthService) {
    this.authService = authService;
  }

  getPizzas(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(`${environment.backendBaseUrl}/pizzas`);
  }

  getPizzaById(idPizza: any): Observable<Pizza> {
    return this.http.get<Pizza>(`${environment.backendBaseUrl}/pizzas/${idPizza}`);
  }

  createCustomer(customer: NewCustomer): Observable<Customer> {
    customer.firstName = toTitleCase(customer.firstName.trim());
    customer.lastName = customer.lastName.trim().toUpperCase();
    customer.emailAddress = customer.emailAddress.trim().toLowerCase();
    return this.http.post<Customer>(`${environment.backendBaseUrl}/customers/register`, customer);
  }

  loginCustomer(email: string, password: string): Observable<string> {
    return this.http.post(`${environment.backendBaseUrl}/customers/login`,
      { email: email.trim().toLowerCase(), password },
      { responseType: 'text' });
  }

  loginCustomerWithInfo(email: string, password: string): Observable<Customer> {
    return this.loginCustomer(email, password).pipe(
      map(token => {
        const payload = JSON.parse(atob(token.split('.')[1])); // atob = decode base64 et split('.')[1] permet d'obtenir le payload

        const customer: Customer = {
          idCustomer: payload.id,
          firstName: payload.firstName,
          lastName: payload.lastName,
          emailAddress: payload.emailAddress,
          wallet: payload.wallet,
          isAdmin: payload.isAdmin
        };
        this.authService.login(token, customer);
        return customer;
      })
    );
  }

  purchasePizza(dico: { [key: string]: OrderLine[] }): Observable<string> {
    const token = localStorage.getItem('authToken');

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    // Indique à Angular de traiter la réponse comme du texte brut
    return this.http.post(`${environment.backendBaseUrl}/purchases/buy`, dico, {
      headers,
      responseType: 'text'
    });
  }

}
