import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { Customer } from '../../core/models/customer.model';
import { environment } from '../../../environments/environment';
import { getHeaders } from '../../shared/utils/functions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private _isLoggedIn: WritableSignal<boolean> = signal<boolean>(!!localStorage.getItem('authToken'));
  private _currentUser: WritableSignal<Customer | null> = signal<Customer | null>(this.getUserFromStorage());


  public readonly isLoggedIn: Signal<boolean> = this._isLoggedIn.asReadonly();
  public readonly currentUser: Signal<Customer | null> = this._currentUser.asReadonly();

  public readonly isAdmin: Signal<boolean> = computed(() => this._currentUser()?.isAdmin ?? false);

  public updateLocalCusomerDataFromToken(token: string): void {
    localStorage.setItem('authToken', token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    const customer: Customer = {
      idCustomer: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      emailAddress: payload.emailAddress,
      wallet: payload.wallet,
      isAdmin: payload.isAdmin
    };
    localStorage.setItem('customer', JSON.stringify(customer));
    this._currentUser.set(customer);
  }

  login(email: string, password: string): Observable<Customer> {
    return this.http.post<any>(`${environment.backendBaseUrl}/customers/login`, {
      email: email.trim().toLowerCase(),
      password
    }).pipe(
      tap(dico => {
        this.updateLocalCusomerDataFromToken(dico.token);
        this._isLoggedIn.set(true);
      }),
      map(() => this._currentUser()!)
    );
  }

  logout(): void {
    localStorage.clear();
    this._isLoggedIn.set(false);
    this._currentUser.set(null);
    this.router.navigate(['/home']);
  }

  checkToken(): Observable<any> {
    return this.http.get(`${environment.backendBaseUrl}/customers/checkToken`,
      { headers: getHeaders() }
    );
  }

  private getUserFromStorage(): Customer | null {
    const data = localStorage.getItem('customer');
    return data ? JSON.parse(data) : null;
  }
}