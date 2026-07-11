import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetailledPizza, Pizza } from '../../models/pizza.model';
import { Customer, NewCustomer, LoginDTO } from '../../models/customer.model';
import { toTitleCase } from '../../tools/functions';
import { AuthService } from '../auth/auth';

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

  getPizzaById(idPizza: any): Observable<DetailledPizza> {
    return this.http.get<DetailledPizza>(`${environment.backendBaseUrl}/pizzas/${idPizza}`);
  }

  createCustomer(customer: NewCustomer): Observable<Customer> {
    customer.firstName = toTitleCase(customer.firstName.trim());
    customer.lastName = customer.lastName.trim().toUpperCase();
    customer.emailAddress = customer.emailAddress.trim().toLowerCase();
    return this.http.post<Customer>(`${environment.backendBaseUrl}/customers/register`, customer);
  }

  loginCustomer(email: string, password: string): Observable<string> {
    return this.http.post('http://localhost:8081/api-backend/customers/login',
      { email: email.trim().toLowerCase(), password },
      { responseType: 'text' }); // <- important !
  }



  loginCustomerWithInfo(email: string, password: string): Observable<Customer> {
    return this.loginCustomer(email, password).pipe( 
      map(token => {           // token est déjà une string
        const payload = JSON.parse(atob(token.split('.')[1]));

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

}
