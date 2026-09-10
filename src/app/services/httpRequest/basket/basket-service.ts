import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AdaptedOrderLine } from '../../../models/orderLine.model';
import { Observable } from 'rxjs';
import { getHeaders } from '../../../utils/functions';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  constructor(private http: HttpClient) {}

  getBasket(): Observable<{ [key: string]: AdaptedOrderLine[] }> {
    return this.http.get<{ [key: string]: AdaptedOrderLine[] }>(
      `${environment.backendBaseUrl}/customers/basket`,
      { headers: getHeaders() }
    );
  }

  saveBasket(basket: { [key: string]: AdaptedOrderLine[] }): Observable<any> {
    return this.http.post(
      `${environment.backendBaseUrl}/customers/saveBasket`,
      basket,
      { headers: getHeaders() }
    );
  }
}
