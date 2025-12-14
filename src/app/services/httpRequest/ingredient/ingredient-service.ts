import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Ingredient } from '../../../models/ingredient.model';
import { Observable } from 'rxjs';
import { getHeaders } from '../../../utils/functions';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${environment.backendBaseUrl}/ingredients`, 
      { headers: getHeaders() }
    );
  }

  search(partialName: string): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${environment.backendBaseUrl}/ingredients/${partialName}`, 
      { headers: getHeaders() }
    );
  }

  add(name: string): Observable<any> {
    return this.http.post(`${environment.backendBaseUrl}/ingredients/add`, name, 
      { headers: getHeaders() }
    );
  }

  update(ingredient: Ingredient): Observable<any> {
    return this.http.post(`${environment.backendBaseUrl}/ingredients/update`, ingredient, 
      { headers: getHeaders() }
    );
  }

  delete(id: number): Observable<any> {
    return this.http.post(`${environment.backendBaseUrl}/ingredients/delete`, id, 
          { headers: getHeaders() }
        );
  }
}
