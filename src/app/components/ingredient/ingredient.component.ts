import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { ApiService } from '../../services/api/api';
import { Ingredient } from '../../models/ingredient.model';
import { LoaderService } from '../../services/loaderService/loader-service';
import { PopupService } from '../../services/popup/popup';
import { formatErrorMessage, toTitleCase } from '../../tools/functions';
import { Router } from '@angular/router';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.css'],
  imports: [CommonModule, FormsModule]
})
export class IngredientComponent implements OnInit {

  ingredients: Ingredient[] = [];
  searchValue = '';
  newIngredientName = '';

  constructor(
    private apiService: ApiService,
    private loaderService: LoaderService,
    private popupService: PopupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const customer : Customer = JSON.parse(localStorage.getItem('customer')!);
    if (!customer || !customer.isAdmin) {
      this.router.navigate(['/home']);
      return;
    }
    this.loadAllIngredients();
  }

  loadAllIngredients(): void {
    this.loaderService.show();

    this.apiService.getAllIngredients()
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: data => {
          this.ingredients = data;
        },
        error: err => {
          this.popupService.showMessage(formatErrorMessage(err));
        }
      });
  }

  onSearchChange(): void {
    this.searchValue = toTitleCase(this.searchValue);
    if (this.searchValue.length === 0) {
      this.loadAllIngredients();
      return;
    }

    else if (this.searchValue.length > 0) {
      this.loaderService.show();

      this.apiService.getIngredientByPartialName(this.searchValue)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe({
          next: data => {
            this.ingredients = data;

            if (data.length === 0) {
              this.popupService.showMessage(
                'Ingrédient introuvable, voulez-vous l’ajouter ?'
              );
            }
          },
          error: err => {
            this.popupService.showMessage(formatErrorMessage(err));
          }
        });
    }
  }

  /* ===================== UPDATE ===================== */

  updateIngredient(ingredient: Ingredient): void {
    ingredient.nameIngredient = toTitleCase(ingredient.nameIngredient);
    this.loaderService.show();

    this.apiService.updateIngredient(ingredient)
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: () => {
          this.popupService.showMessage('Ingrédient mis à jour avec succès');
          this.loadAllIngredients();
        },
        error: err => {
          this.popupService.showMessage(formatErrorMessage(err));
        }
      });
  }

  /* ===================== DELETE ===================== */

  deleteIngredient(id: number): void {
    this.loaderService.show();

    this.apiService.deleteIngredient(id)
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: () => {
          this.popupService.showMessage('Ingrédient supprimé');
          this.loadAllIngredients();
        },
        error: err => {
          this.popupService.showMessage(formatErrorMessage(err));
        }
      });
  }

  /* ===================== ADD ===================== */

  addIngredient(name?: string): void {
    const ingredientName = toTitleCase(name || this.newIngredientName);
    if (!ingredientName) return;

    this.loaderService.show();

    this.apiService.createIngredient(ingredientName)
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: () => {
          this.popupService.showMessage('Ingrédient ajouté avec succès');
          this.newIngredientName = '';
          this.searchValue = '';
          this.loadAllIngredients();
        },
        error: err => {
          this.popupService.showMessage(formatErrorMessage(err));
        }
      });
  }
}
