import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AdaptedOrderLine } from '../../../models/orderLine.model';
import { Invoice } from '../../../models/invoice.model';
import { Observable } from 'rxjs';
import { getHeaders } from '../../../utils/functions';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  constructor(private http: HttpClient) {}

  purchasePizza(dico: { [key: string]: AdaptedOrderLine[] }): Observable<any> {
    return this.http.post(`${environment.backendBaseUrl}/purchases/buy`, dico, 
          { headers: getHeaders() }
        );
  }

  getAllInvoicesByCustomer(): Observable<Invoice[]> {
    const idCustomer = JSON.parse(localStorage.getItem('customer') || '{}').idCustomer;
    return this.http.get<Invoice[]>(`${environment.backendBaseUrl}/purchases/invoices/customer/${idCustomer}`, 
          { headers: getHeaders() }
        );
  }
}
