import { Injectable } from '@angular/core';
import { BehaviorSubject, findIndex } from 'rxjs';
import { OrderLine } from '../../models/orderLine.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private countItemSubject = new BehaviorSubject<number>(this.getTotalItemCount());
  countItem$ = this.countItemSubject.asObservable();

  private getTotalItemCount(): number {
    const basket = this.getBasket();
    let total = 0;
    for (const pizzaName in basket) {
      total += basket[pizzaName].reduce((sum, line) => sum + line.quantity, 0);
    }
    return total;
  }

  /** Récupère le panier depuis le localStorage */
  getBasket(): { [key: string]: OrderLine[] } {
    try {
      const saved = localStorage.getItem('basket');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  /** Sauvegarde le panier dans le localStorage */
  public saveBasket(basket: { [key: string]: OrderLine[] }): void {
    localStorage.setItem('basket', JSON.stringify(basket));
    this.countItemSubject.next(this.getTotalItemCount());
  }


  /** Ajoute une pizza au panier */
  addToBasket(pizzaName: string, sizeName: string, price: number): void {
    const basket = this.getBasket();
    const allSizeForPizza = basket[pizzaName];
    if (allSizeForPizza) {
      const orderLine = allSizeForPizza.find(line => line.sizeName === sizeName);
      if (orderLine) {
        orderLine.quantity += 1;
      } else {
        allSizeForPizza.push({ sizeName, quantity: 1, price });
      }
    }
    else {
      const newOrderLine: OrderLine = { sizeName, quantity: 1, price };
      basket[pizzaName] = [newOrderLine];
    }
    console.log('basket :', basket);
    this.saveBasket(basket);
  }


  /** Retire une pizza du panier */
  removeFromBasket(pizzaName: string, sizeName: string): void {
    const basket = this.getBasket();
    const allSizeForPizza = basket[pizzaName];
    if (allSizeForPizza) {
      const orderLine = allSizeForPizza.find(line => line.sizeName === sizeName);
      if (orderLine) {
        orderLine.quantity -= 1;
        if (orderLine.quantity <= 0) {
          allSizeForPizza.splice(allSizeForPizza.indexOf(orderLine), 1);
          if (allSizeForPizza.length === 0) {
            delete basket[pizzaName];
          }
        }
        else {
          console.log("Removed one " + sizeName + " of pizza " + pizzaName + " from basket.");
        }
      }
    }
    else {
      console.error("Pizza" + pizzaName + " not found in basket");
    }
    this.saveBasket(basket);
  }

  clearBasket(): void {
    this.saveBasket({});
  }
}
