import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize } from 'rxjs';
import { AdaptedOrderLine } from '../../models/orderLine.model';
import { LoaderService } from '../tools/loader/loader-service';
import { BasketService } from '../httpRequest/basket/basket-service';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  /* State réactif du panier */
  private basketSubject = new BehaviorSubject<{ [key: string]: AdaptedOrderLine[] }>(
    this.getBasket()
  );
  basket$ = this.basketSubject.asObservable();

  /* Nombre total d’items */
  private countItemSubject = new BehaviorSubject<number>(this.getTotalItemCount());
  countItem$ = this.countItemSubject.asObservable();

  constructor(
    private basketService: BasketService,
    private loaderService: LoaderService
  ) {}

  /* ---------- Utils ---------- */

  private getTotalItemCount(): number {
    const basket = this.getBasket();
    let total = 0;

    for (const pizzaName in basket) {
      total += basket[pizzaName].reduce(
        (sum, line) => sum + line.quantity,
        0
      );
    }

    return total;
  }

  /* Récupère le panier depuis le localStorage */
  getBasket(): { [key: string]: AdaptedOrderLine[] } {
    try {
      const saved = localStorage.getItem('basket');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  /* Sauvegarde locale + émission du state */
  private updateLocalBasket(basket: { [key: string]: AdaptedOrderLine[] }): void {
    localStorage.setItem('basket', JSON.stringify(basket));
    this.basketSubject.next(basket);
    this.countItemSubject.next(this.getTotalItemCount());
  }

  /* ---------- Sync serveur ---------- */

  public saveBasket(basket: { [key: string]: AdaptedOrderLine[] }): void {
    /* Mise à jour immédiate UI */
    this.updateLocalBasket(basket);

    this.loaderService.show();
    this.basketService.saveBasket(basket)
      .pipe(
        finalize(() => this.loaderService.hide())
      )
      .subscribe({
        error: err => {
          console.error('Error saving basket to server:', err);
        }
      });
  }

  public refreshBasketFromServer(): void {
    this.loaderService.show();

    this.basketService.getBasket()
      .pipe(
        finalize(() => this.loaderService.hide())
      )
      .subscribe({
        next: basket => {
          this.updateLocalBasket(basket);
        },
        error: err => {
          console.error('Error retrieving basket from server:', err);
        }
      });
  }

  /* ---------- Mutations ---------- */

  public addToBasket(pizzaName: string, sizeName: string, price: number): void {
    const basket = this.getBasket();
    const allSizeForPizza = basket[pizzaName];

    if (allSizeForPizza) {
      const orderLine = allSizeForPizza.find(
        line => line.nameSize === sizeName
      );

      if (orderLine) {
        orderLine.quantity += 1;
      } else {
        allSizeForPizza.push({
          nameSize: sizeName,
          quantity: 1,
          price
        });
      }
    } else {
      basket[pizzaName] = [{
        nameSize: sizeName,
        quantity: 1,
        price
      }];
    }

    this.saveBasket(basket);
  }

  public removeFromBasket(pizzaName: string, sizeName: string): void {
    const basket = this.getBasket();
    const allSizeForPizza = basket[pizzaName];

    if (!allSizeForPizza) {
      return;
    }

    const orderLine = allSizeForPizza.find(
      line => line.nameSize === sizeName
    );

    if (!orderLine) {
      return;
    }

    orderLine.quantity -= 1;

    if (orderLine.quantity <= 0) {
      allSizeForPizza.splice(
        allSizeForPizza.indexOf(orderLine),
        1
      );

      if (allSizeForPizza.length === 0) {
        delete basket[pizzaName];
      }
    }

    this.saveBasket(basket);
  }

  public clearBasket(): void {
    this.saveBasket({});
  }
}
