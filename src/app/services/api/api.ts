import { Injectable } from '@angular/core';
import { finalize, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { NewPizza, Pizza, UpdatedPizza } from '../../models/pizza.model';
import { Ingredient } from '../../models/ingredient.model';

import { Customer, NewCustomer, LoginDTO } from '../../models/customer.model';
import { toTitleCase } from '../../tools/functions';
import { AdaptedOrderLine } from '../../models/orderLine.model';
import { Invoice } from '../../models/invoice.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('authToken')); // BehaviorSubject pour émettre l'état initial
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {
  }

  getPizzasAvailable(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(`${environment.backendBaseUrl}/pizzas`);
  }

  getPizzaById(idPizza: any): Observable<Pizza> {
    return this.http.get<Pizza>(`${environment.backendBaseUrl}/pizzas/${idPizza}`);
  }

  getAllPizzas(): Observable<Pizza[]> {
    const headers = ApiService.getHeaderWithAuthToken();
    return this.http.get<Pizza[]>(`${environment.backendBaseUrl}/pizzas/all`, { headers });
  }

  createCustomer(customer: NewCustomer): Observable<Customer> {
    customer.firstName = toTitleCase(customer.firstName.trim());
    customer.lastName = customer.lastName.trim().toUpperCase();
    customer.emailAddress = customer.emailAddress.trim().toLowerCase();
    return this.http.post<Customer>(`${environment.backendBaseUrl}/customers/register`, customer);
  }

  checkToken(): Observable<any> {
    const headers = ApiService.getHeaderWithAuthToken();
    return this.http.get(`${environment.backendBaseUrl}/customers/checkToken`, { headers, responseType: 'json' });
  }

  logoutCustomer(): void {    
    localStorage.removeItem('authToken');
    localStorage.removeItem('customer');
    this.loggedIn.next(false);
    this.router.navigate(['/home']);
  }

  loginCustomer(email: string, password: string): Observable<any> {
    const credentials = { email: email.trim().toLowerCase(), password };
    return this.http.post(`${environment.backendBaseUrl}/customers/login`,
      credentials,
      { responseType: 'json' });
  }

  loginCustomerWithInfo(email: string, password: string): Observable<Customer> {
    return this.loginCustomer(email, password).pipe(
      map(dico => {
        const payload = JSON.parse(atob(dico.token.split('.')[1])); // atob = decode base64 et split('.')[1] permet d'obtenir le payload

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
        this.loggedIn.next(true);
        return customer;
      })
    );
  }

  updateCustomer(customer: Customer): Observable<any> {
    const headers = ApiService.getHeaderWithAuthToken();
    customer.lastName = customer.lastName.trim().toUpperCase();
    customer.firstName = toTitleCase(customer.firstName.trim());
    customer.emailAddress = customer.emailAddress.trim().toLowerCase();
    return this.http.post(`${environment.backendBaseUrl}/customers/update`, customer, { headers, responseType: 'json' });
  }
  changeCustomerPassword(password: string): Observable<any> {
    const headers = ApiService.getHeaderWithAuthToken();
    return this.http.post(`${environment.backendBaseUrl}/customers/updatePassword`, password, { headers, responseType: 'json' });
  }

  rechargeWallet(amount: number): Observable<any> {
    const headers = ApiService.getHeaderWithAuthToken();
    return this.http.post(`${environment.backendBaseUrl}/customers/walletRecharge`, amount, { headers, responseType: 'json' });
  }

  deleteCustomer(): Observable<any> {
    const headers = ApiService.getHeaderWithAuthToken();
    return this.http.post(`${environment.backendBaseUrl}/customers/deleteAccount`, {}, { headers, responseType: 'json' });
  }

  getBasketFromServer(): Observable<{ [key: string]: AdaptedOrderLine[] }> {
    const headers = ApiService.getHeaderWithAuthToken();
    return this.http.get<{ [key: string]: AdaptedOrderLine[] }>(`${environment.backendBaseUrl}/customers/basket`, { headers });
  }

  saveBasketToServer(dico: { [key: string]: AdaptedOrderLine[] }): Observable<any> {
    const headers = ApiService.getHeaderWithAuthToken();
    return this.http.post(`${environment.backendBaseUrl}/customers/saveBasket`, dico, { headers, responseType: 'json' });
  }

  purchasePizza(dico: { [key: string]: AdaptedOrderLine[] }): Observable<any> {
    const headers = ApiService.getHeaderWithAuthToken();

    // Indique à Angular de traiter la réponse comme du texte brut
    return this.http.post(`${environment.backendBaseUrl}/purchases/buy`, dico, {
      headers,
      responseType: 'json'
    });
  }

  getAllInvoicesByCustomer(): Observable<Invoice[]> {
    const idCustomer = JSON.parse(localStorage.getItem('customer') || '{}').idCustomer;
    const headers = ApiService.getHeaderWithAuthToken();
    return this.http.get<Invoice[]>(`${environment.backendBaseUrl}/purchases/invoices/customer/${idCustomer}`, { headers });
  }

  addPizza(newPizza: NewPizza): Observable<any> {
    const headers = ApiService.getHeaderWithAuthToken();
    return this.http.post(`${environment.backendBaseUrl}/pizzas/add`, newPizza, { headers, responseType: 'json' });
  }

  updatePizza(pizza: UpdatedPizza): Observable<any> {
    const headers = ApiService.getHeaderWithAuthToken();
    return this.http.post(`${environment.backendBaseUrl}/pizzas/update`, pizza, { headers, responseType: 'json' });
  }

  getAllIngredients(): Observable<Ingredient[]> {
    const headers = ApiService.getHeaderWithAuthToken();
    return this.http.get<Ingredient[]>(`${environment.backendBaseUrl}/ingredients`, { headers });
  }

  getIngredientByPartialName(partialName: string): Observable<Ingredient[]> {
    const headers = ApiService.getHeaderWithAuthToken();
    return this.http.get<Ingredient[]>(`${environment.backendBaseUrl}/ingredients/${partialName}`, { headers });
  }

  createIngredient(ingredientName: string): Observable<any> {
    const headers = ApiService.getHeaderWithAuthToken();
    return this.http.post(`${environment.backendBaseUrl}/ingredients/add`, ingredientName, { headers, responseType: 'json' });
  }

  updateIngredient(ingredient: Ingredient): Observable<any> {
    const headers = ApiService.getHeaderWithAuthToken();
    return this.http.post(`${environment.backendBaseUrl}/ingredients/update`, ingredient, { headers, responseType: 'json' });
  }

  deleteIngredient(idIngredient: number): Observable<any> {
    const headers = ApiService.getHeaderWithAuthToken();
    return this.http.post(`${environment.backendBaseUrl}/ingredients/delete`, idIngredient, { headers, responseType: 'json' });
  }

  private static getHeaderWithAuthToken(): { [header: string]: string } { // { [header: string]: string } veut dire un objet avec des clés de type string et des valeurs de type string
    const token = localStorage.getItem('authToken') || '';
    return { 'Authorization': `Bearer ${token}` };
  }
}
