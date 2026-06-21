import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pizza, NewPizza, UpdatedPizza } from '../../core/models/pizza.model';
import { getHeaders } from '../../shared/utils/functions';

@Injectable({
  providedIn: 'root',
})
export class PizzaService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.backendBaseUrl}/pizzas`;

  /**
   * Récupère les pizzas disponibles pour le menu public
   */
  getAvailable(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(this.baseUrl);
  }

  /**
   * Récupère toutes les pizzas (y compris indisponibles) - Réservé Admin
   */
  getAll(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(`${this.baseUrl}/all`, {
      headers: getHeaders(),
    });
  }

  /**
   * Récupère une pizza par son ID ou son nom
   */
  getById(id: string): Observable<Pizza> {
    return this.http.get<Pizza>(`${this.baseUrl}/${id}`);
  }

  /**
   * Ajoute une nouvelle pizza
   */
  add(newPizza: NewPizza): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, newPizza, {
      headers: getHeaders(),
    });
  }

  /**
   * Met à jour une pizza existante
   */
  update(pizza: UpdatedPizza): Observable<any> {
    return this.http.post(`${this.baseUrl}/update`, pizza, {
      headers: getHeaders(),
    });
  }
}
