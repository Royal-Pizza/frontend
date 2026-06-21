import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Customer, NewCustomer } from '../models/customer.model';
import { getHeaders, toTitleCase } from '../../shared/utils/functions';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.backendBaseUrl}/customers`;

  /**
   * Inscription d'un nouveau client
   */
  register(customer: NewCustomer): Observable<Customer> {
    const formatted = this.formatCustomerData(customer);
    return this.http.post<Customer>(`${this.baseUrl}/register`, formatted);
  }

  /**
   * Mise à jour des informations profil
   */
  update(customer: Customer): Observable<any> {
    const formatted = this.formatCustomerData(customer);
    return this.http.post(`${this.baseUrl}/update`, formatted, {
      headers: getHeaders(),
    });
  }

  changePassword(password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/updatePassword`, password, {
      headers: getHeaders(),
    });
  }

  rechargeWallet(amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/walletRecharge`, amount, {
      headers: getHeaders(),
    });
  }

  delete(): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/deleteAccount`,
      {},
      {
        headers: getHeaders(),
      },
    );
  }

  /**
   * Méthode privée pour centraliser le formatage
   */
  private formatCustomerData<T extends NewCustomer | Customer>(data: T): T {
    return {
      ...data,
      firstName: toTitleCase(data.firstName.trim()),
      lastName: data.lastName.trim().toUpperCase(),
      emailAddress: data.emailAddress.trim().toLowerCase(),
    };
  }
}
