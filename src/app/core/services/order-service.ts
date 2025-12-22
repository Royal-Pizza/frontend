import { inject, Injectable, signal, computed, Signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BasketData } from '../models/basket.model';
import { LoaderService } from '../../shared/services/loader-service';
import { getHeaders } from '../../shared/utils/functions';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly loaderService = inject(LoaderService);
  private readonly baseUrl = `${environment.backendBaseUrl}/customers`;

  private _basket: WritableSignal<BasketData> = signal(this.getBasketFromStorage());
  public readonly basket: Signal<BasketData> = this._basket.asReadonly();

  // --- CALCULS (COMPUTED) ---
  public readonly countItem: Signal<number> = computed(() => {
    const currentBasket = this._basket();
    let total = 0;
    for (const pizzaName in currentBasket) {
      total += currentBasket[pizzaName].reduce((sum, line) => sum + line.quantity, 0);
    }
    return total;
  });

  public readonly totalPrice: Signal<number> = computed(() => {
    const currentBasket = this._basket();
    let total = 0;
    for (const pizzaName in currentBasket) {
      total += currentBasket[pizzaName].reduce((sum, line) => sum + (line.quantity * line.price), 0);
    }
    return Math.round(total * 100) / 100;
  });

  /* ---------- APPELS API (Anciennement BasketService) ---------- */

  private getBasketRemote(): Observable<BasketData> {
    return this.http.get<BasketData>(`${this.baseUrl}/basket`, { headers: getHeaders() });
  }

  private saveBasketRemote(basket: BasketData): Observable<any> {
    return this.http.post(`${this.baseUrl}/saveBasket`, basket, { headers: getHeaders() });
  }

  /* ---------- GESTION DE L'ÉTAT & SYNCHRO ---------- */

  private getBasketFromStorage(): BasketData {
    try {
      const saved = localStorage.getItem('basket');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  private updateState(newBasket: BasketData): void {
    localStorage.setItem('basket', JSON.stringify(newBasket));
    this._basket.set(newBasket);
  }

  public refreshBasketFromServer(): void {
    this.loaderService.show();
    this.getBasketRemote()
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: basket => this.updateState(basket),
        error: err => console.error('Erreur récupération panier:', err)
      });
  }

  public saveBasketToServer(): void {
    const currentBasket = this._basket();
    this.loaderService.show();
    this.saveBasketRemote(currentBasket)
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: () => console.log('Panier synchronisé sur le serveur'),
        error: err => console.error('Erreur sync serveur:', err)
      });
  }

  /* ---------- ACTIONS MÉTIER (MUTATIONS) ---------- */

  public addToBasket(pizzaName: string, sizeName: string, price: number): void {
    const current: BasketData = JSON.parse(JSON.stringify(this._basket()));

    if (!current[pizzaName]) {
      current[pizzaName] = [];
    }

    const orderLine = current[pizzaName].find(line => line.nameSize === sizeName);

    if (orderLine) {
      orderLine.quantity += 1;
    } else {
      current[pizzaName].push({ nameSize: sizeName, quantity: 1, price });
    }

    this.updateState(current);
    this.saveBasketToServer();
  }

  public removeFromBasket(pizzaName: string, sizeName: string): void {
    const current: BasketData = JSON.parse(JSON.stringify(this._basket()));
    const allSizes = current[pizzaName];

    if (!allSizes) return;

    const index = allSizes.findIndex(line => line.nameSize === sizeName);
    if (index === -1) return;

    allSizes[index].quantity -= 1;

    if (allSizes[index].quantity <= 0) {
      allSizes.splice(index, 1);
      if (allSizes.length === 0) delete current[pizzaName];
    }

    this.updateState(current);
    this.saveBasketToServer();
  }

  public clearBasket(): void {
    this.updateState({});
    this.saveBasketToServer();
  }
}