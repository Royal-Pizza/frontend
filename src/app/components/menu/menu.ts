import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Pizza, UpdatedPizza } from '../../models/pizza.model';
import { Router, RouterModule } from '@angular/router';
import { formatErrorMessage } from '../../utils/functions';
import { LoaderService } from '../../services/tools/loader/loader-service';
import { pipe, finalize } from 'rxjs';
import { PopupService } from '../../services/tools/popup/popup';
import { OrderService } from '../../services/order/order-service';
import { PizzaService } from '../../services/httpRequest/pizza/pizza-service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit {

  pizzas: Pizza[] = [];
  isConnected: boolean = false;
  isAdmin: boolean = false;

  constructor(private router: Router, private pizzaService: PizzaService,
    private loaderService: LoaderService, private popupService: PopupService,
    private orderService: OrderService) {

  }

  ngOnInit(): void {
    const customerJson = localStorage.getItem('customer');

    if (customerJson) {
      const customer = JSON.parse(customerJson);
      this.isConnected = true;
      this.isAdmin = customer.isAdmin === true;
    } else {
      this.isConnected = false;
      this.isAdmin = false;
    }

    this.loadPizzas();
  }

  loadPizzas(): void {
    this.loaderService.show();
    if (this.isAdmin) {
      this.pizzaService.getAll()
        .pipe(
          finalize(() => this.loaderService.hide())
        )
        .subscribe({
          next: (data: any[]) => {
            this.pizzas = data;
            console.log('Pizzas reçues :', this.pizzas);
          },
          error: (err) => {
            const formattedError = formatErrorMessage(err);
            const str = 'Erreur chargement pizzas ' + (formattedError ?? '');

            this.popupService.showMessage(str);
          }
        });
    }
    else {
      this.pizzaService.getAvailable()
        .pipe(
          finalize(() => this.loaderService.hide())
        )
        .subscribe({
          next: (data: any[]) => {
            this.pizzas = data;
            console.log('Pizzas reçues :', this.pizzas);
          },
          error: (err) => {
            const str = 'Erreur chargement pizzas ' + formatErrorMessage(err)
            this.popupService.showMessage(str);
          }
        });
    }

  }

  goToPizza(namePizza: string): void {
    this.router.navigate(['/menu', namePizza]); // ✅ correspond à la route définie
  }

  goToEditPizza(namePizza: string): void {
    this.router.navigate(['/menu', namePizza, 'edit']);
  }

  goToNewPizza() {
    this.router.navigate(['/menu', 'new']);
  }

  toggleAvailability(pizza: Pizza): void {
    const updatedPizza: UpdatedPizza = {
      idPizza: pizza.idPizza,
      namePizza: pizza.namePizza,
      pricePizza: pizza.pricePizza['normale'],
      ingredients: pizza.ingredients,
      image: pizza.image,
      available: !pizza.available
    };
    this.pizzaService.update(updatedPizza).subscribe({
      next: () => {
        this.loadPizzas(); // Recharger la liste des pizzas après la mise à jour
        this.orderService.refreshBasketFromServer(); // Met à jour le panier
        console.log("panier : ", this.orderService.getBasket())
      },
      error: (err) => console.error('Erreur mise à jour pizza', formatErrorMessage(err))
    });
  }

}
