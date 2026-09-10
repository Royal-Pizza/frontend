import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Pizza, NewPizza, UpdatedPizza } from '../../../models/pizza.model';
import { Observable } from 'rxjs';
import { getHeaders } from '../../../utils/functions';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  constructor(private http: HttpClient) {}

  getAvailable(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(`${environment.backendBaseUrl}/pizzas`);
  }

  getAll(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(`${environment.backendBaseUrl}/pizzas/all`, 
          { headers: getHeaders() }
        );
  }

  getById(id: string): Observable<Pizza> {
    return this.http.get<Pizza>(`${environment.backendBaseUrl}/pizzas/${id}`);
  }

  add(newPizza: NewPizza): Observable<any> {
    return this.http.post(`${environment.backendBaseUrl}/pizzas/add`, newPizza, 
      { headers: getHeaders() });
  }

  update(pizza: UpdatedPizza): Observable<any> {
    return this.http.post(`${environment.backendBaseUrl}/pizzas/update`, pizza, 
      { headers: getHeaders() });
  }
}
