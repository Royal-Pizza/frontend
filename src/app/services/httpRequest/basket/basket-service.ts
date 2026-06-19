import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BasketData } from '../../../models/basket.model';
import { getHeaders } from '../../../utils/functions';



@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.backendBaseUrl}/customers`;

  /**
   * Récupère le panier du serveur.
   * On garde l'Observable car c'est une requête HTTP ponctuelle.
   */
  getBasket(): Observable<BasketData> {
    return this.http.get<BasketData>(
      `${this.baseUrl}/basket`,
      { headers: getHeaders() }
    );
  }

  /**
   * Sauvegarde le panier actuel sur le serveur.
   */
  saveBasket(basket: BasketData): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/saveBasket`,
      basket,
      { headers: getHeaders() }
    );
  }
}