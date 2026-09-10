import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Ingredient } from '../../models/ingredient.model';
import { LoaderService } from '../../services/tools/loader/loader-service';
import { PopupService } from '../../services/tools/popup/popup';
import { formatErrorMessage, toTitleCase } from '../../utils/functions';
import { Router } from '@angular/router';
import { Customer } from '../../models/customer.model';
import { IngredientService } from '../../services/httpRequest/ingredient/ingredient-service';

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
    private ingredientService: IngredientService,
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

    this.ingredientService.getAll()
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

      this.ingredientService.search(this.searchValue)
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

    this.ingredientService.update(ingredient)
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

    this.ingredientService.delete(id)
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

    this.ingredientService.add(ingredientName)
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
