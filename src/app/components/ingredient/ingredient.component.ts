import { Component, inject, OnInit, signal, computed, WritableSignal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Ingredient } from '../../models/ingredient.model';
import { LoaderService } from '../../services/tools/loader-service';
import { PopupService } from '../../services/tools/popup';
import { IngredientService } from '../../services/httpRequest/ingredient-service';
import { formatErrorMessage, toTitleCase } from '../../utils/functions';
import { AuthService } from '../../services/httpRequest/auth-service';

@Component({
  selector: 'app-ingredient',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.css']
})
export class IngredientComponent implements OnInit {
  private readonly ingredientService = inject(IngredientService);
  private readonly authService = inject(AuthService);
  private readonly loaderService = inject(LoaderService);
  private readonly popupService = inject(PopupService);
  private readonly router = inject(Router);

  public readonly ingredients: WritableSignal<Ingredient[]> = signal([]);
  public readonly searchValue: WritableSignal<string> = signal('');
  public readonly newIngredientName: WritableSignal<string> = signal('');

  private readonly searchSubject = new Subject<string>();

  public readonly hasNoResults: Signal<boolean> = computed(() => {
    return this.ingredients().length === 0 && this.searchValue().length >= 1;
  });

  ngOnInit(): void {
    if (!this.authService.isLoggedIn() || !this.authService.isAdmin()) {
      this.router.navigate(['/home']);
      return;
    }

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.performSearch(term);
    });

    this.loadAllIngredients();
  }

  loadAllIngredients(): void {
    this.loaderService.show();
    this.ingredientService.getAll()
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: data => this.ingredients.set(data || []),
        error: err => this.popupService.showMessage(formatErrorMessage(err))
      });
  }

  onSearchChange(): void {
    const term = toTitleCase(this.searchValue());
    this.searchValue.set(term);
    this.searchSubject.next(term);
  }

  private performSearch(term: string): void {
    if (term.length === 0) {
      this.loadAllIngredients();
      return;
    }

    this.loaderService.show();
    this.ingredientService.search(term)
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: data => {
          this.ingredients.set(data || []);
          if (!data || data.length === 0) {
            this.popupService.showMessage('Ingrédient introuvable, voulez-vous l’ajouter ?');
          }
        },
        error: err => this.popupService.showMessage(formatErrorMessage(err))
      });
  }

  updateIngredient(ingredient: Ingredient): void {
    const updatedName = toTitleCase(ingredient.nameIngredient);
    this.loaderService.show();

    this.ingredientService.update({ ...ingredient, nameIngredient: updatedName })
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: () => {
          this.popupService.showMessage('Mis à jour avec succès');
          this.loadAllIngredients();
        },
        error: err => this.popupService.showMessage(formatErrorMessage(err))
      });
  }

  deleteIngredient(id: number): void {
    if (!confirm('Supprimer ?')) return;

    this.loaderService.show();
    this.ingredientService.delete(id)
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: () => {
          this.ingredients.update(list => list.filter(i => i.idIngredient !== id));
          this.popupService.showMessage('Supprimé');
        },
        error: err => this.popupService.showMessage(formatErrorMessage(err))
      });
  }

  addIngredient(nameFromSearch?: string): void {
    const name = toTitleCase(nameFromSearch || this.newIngredientName());
    if (!name) return;

    this.loaderService.show();
    this.ingredientService.add(name)
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: (newIng) => {
          // PROTECTION : Si l'API renvoie null ou n'a pas d'ID, on recharge tout proprement
          if (!newIng || !newIng.idIngredient) {
            this.loadAllIngredients();
          } else {
            this.ingredients.update(list => [...list, newIng]);
          }
          this.newIngredientName.set('');
          this.searchValue.set(''); // On vide aussi la recherche si on vient du bouton rapide
          this.popupService.showMessage('Ajouté');
        },
        error: (err) => this.popupService.showMessage(formatErrorMessage(err))
      });
  }
}