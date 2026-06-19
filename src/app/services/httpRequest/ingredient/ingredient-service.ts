import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Ingredient } from '../../../models/ingredient.model';
import { getHeaders } from '../../../utils/functions';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.backendBaseUrl}/ingredients`;

  /**
   * Récupère tous les ingrédients
   */
  getAll(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.baseUrl, { 
      headers: getHeaders() 
    });
  }

  /**
   * Recherche par nom partiel
   */
  search(partialName: string): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${this.baseUrl}/${partialName}`, { 
      headers: getHeaders() 
    });
  }

  /**
   * Ajoute un nouvel ingrédient
   * @param name Nom de l'ingrédient
   */
  add(name: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, name, { 
      headers: getHeaders() 
    });
  }

  /**
   * Modifie un ingrédient existant
   */
  update(ingredient: Ingredient): Observable<any> {
    return this.http.post(`${this.baseUrl}/update`, ingredient, { 
      headers: getHeaders() 
    });
  }

  /**
   * Supprime un ingrédient par son ID
   */
  delete(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/delete`, id, { 
      headers: getHeaders() 
    });
  }
}