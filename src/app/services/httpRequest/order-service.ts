import { inject, Injectable, signal, computed, Signal, WritableSignal } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../tools/loader-service';
import { BasketService } from './basket-service';
import { BasketData } from '../../models/basket.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly basketService = inject(BasketService);
  private readonly loaderService = inject(LoaderService);

  private _basket: WritableSignal<BasketData> = signal(this.getBasketFromStorage());
  public readonly basket: Signal<BasketData> = this._basket.asReadonly();

  public readonly countItem: Signal<number> = computed(() => {
    const currentBasket = this._basket();
    let total = 0;
    for (const pizzaName in currentBasket) {
      total += currentBasket[pizzaName].reduce((sum, line) => sum + line.quantity, 0);
    }
    return total;
  });

  // Prix total (calculé automatiquement)
  public readonly totalPrice: Signal<number> = computed(() => {
    const currentBasket = this._basket();
    let total = 0;
    for (const pizzaName in currentBasket) {
      total += currentBasket[pizzaName].reduce((sum, line) => sum + (line.quantity * line.price), 0);
    }
    return Math.round(total * 100) / 100;
  });

  /* ---------- GESTION LOCALE ---------- */

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

  public saveBasketToServer(): void {
    const currentBasket = this._basket();
    this.loaderService.show();

    this.basketService.saveBasket(currentBasket)
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: () => console.log('Panier synchronisé sur le serveur'),
        error: err => console.error('Erreur sync serveur:', err)
      });
  }

  public refreshBasketFromServer(): void {
    this.loaderService.show();
    this.basketService.getBasket()
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: basket => this.updateState(basket),
        error: err => console.error('Erreur récupération serveur:', err)
      });
  }

  /* ---------- MUTATIONS (LOGIQUE MÉTIER) ---------- */

  public addToBasket(pizzaName: string, sizeName: string, price: number): void {
    // 1. On crée une copie profonde pour respecter l'immutabilité des signaux
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

    // 2. On met à jour l'UI immédiatement sans attendre le serveur
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

    // 2. On met à jour l'UI immédiatement
    this.updateState(current);
    this.saveBasketToServer();
  }

  public clearBasket(): void {
    this.updateState({});
    // Ici on peut décider de synchroniser le vide sur le serveur tout de suite
    this.saveBasketToServer();
  }
}