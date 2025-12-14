import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Customer, NewCustomer } from '../../../models/customer.model';
import { Observable } from 'rxjs';
import { getHeaders, toTitleCase } from '../../../utils/functions';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  register(customer: NewCustomer): Observable<Customer> {
    customer.firstName = toTitleCase(customer.firstName.trim());
    customer.lastName = customer.lastName.trim().toUpperCase();
    customer.emailAddress = customer.emailAddress.trim().toLowerCase();
    return this.http.post<Customer>(`${environment.backendBaseUrl}/customers/register`, customer);
  }

  update(customer: Customer): Observable<any> {
    customer.firstName = toTitleCase(customer.firstName.trim());
    customer.lastName = customer.lastName.trim().toUpperCase();
    customer.emailAddress = customer.emailAddress.trim().toLowerCase();
    return this.http.post(`${environment.backendBaseUrl}/customers/update`, customer, 
      { headers: getHeaders() }
    );
  }

  changePassword(password: string): Observable<any> {
    return this.http.post(`${environment.backendBaseUrl}/customers/updatePassword`, password, 
      { headers: getHeaders() }
    );
  }

  rechargeWallet(amount: number): Observable<any> {
    return this.http.post(`${environment.backendBaseUrl}/customers/walletRecharge`, amount, 
      { headers: getHeaders() }
    );
  }

  delete(): Observable<any> {
    return this.http.post(`${environment.backendBaseUrl}/customers/deleteAccount`, 
      { headers: getHeaders() }
    );
  }
}
