import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdaptedOrderLine } from '../models/orderLine.model';
import { Invoice } from '../models/invoice.model';
import { getHeaders } from '../../shared/utils/functions';
import { AuthService } from '../auth/auth-service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private http = inject(HttpClient);
  private authService = inject(AuthService); // On injecte l'auth

  private readonly baseUrl = `${environment.backendBaseUrl}/purchases`;

  /**
   * Finalise l'achat des pizzas présentes dans le panier
   */
  purchasePizza(dico: { [key: string]: AdaptedOrderLine[] }): Observable<any> {
    return this.http.post(`${this.baseUrl}/buy`, dico, {
      headers: getHeaders()
    });
  }

  /**
   * Récupère l'historique des factures du client connecté
   */
  getAllInvoicesByCustomer(): Observable<Invoice[]> {
    // Utilisation du Signal currentUser de l'AuthService
    const customerId = this.authService.currentUser()?.idCustomer;

    if (!customerId) {
      // Si pas de client, on retourne une erreur ou un tableau vide
      console.error("Tentative de récupérer des factures sans être connecté");
    }

    return this.http.get<Invoice[]>(`${this.baseUrl}/invoices/customer/${customerId}`, {
      headers: getHeaders()
    });
  }
}