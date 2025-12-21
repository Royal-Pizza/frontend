import { Component, OnInit, HostListener, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, startWith } from 'rxjs';

import { BaseFormComponent } from '../baseForm.class';
import { Ingredient } from '../../../models/ingredient.model';
import { NewPizza, Pizza, UpdatedPizza } from '../../../models/pizza.model';
import { LoaderService } from '../../../services/tools/loader-service';
import { PopupService } from '../../../services/tools/popup';
import { OrderService } from '../../../services/httpRequest/order-service';
import { IngredientService } from '../../../services/httpRequest/ingredient-service';
import { PizzaService } from '../../../services/httpRequest/pizza-service';
import { toTitleCase, formatErrorMessage } from '../../../utils/functions';
import { AuthService } from '../../../services/httpRequest/auth-service';

@Component({
  selector: 'app-pizza-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './pizza-form.html',
  styleUrls: ['./pizza-form.css']
})
export class PizzaFormComponent extends BaseFormComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly pizzaService = inject(PizzaService);
  private readonly ingredientService = inject(IngredientService);
  private readonly loaderService = inject(LoaderService);
  private readonly popupService = inject(PopupService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // Validateur typé pour le prix
  positiveNumberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') return null;
    const value = parseFloat(control.value.toString().replace(',', '.'));
    return !isNaN(value) && value >= 0.01 ? null : { positiveNumber: true };
  };

  // Formulaire avec types explicites pour éviter les erreurs "null"
  public override form = this.fb.group({
    namePizza: ['', [Validators.required, Validators.minLength(2)]],
    pricePizza: ['', [Validators.required, this.positiveNumberValidator]],
    ingredients: [[] as string[], [Validators.required]],
    imagePreview: this.fb.control<string | null>(null, [Validators.required])
  });

  public readonly pizza = signal<Pizza | null>(null);
  public readonly allIngredients = signal<Ingredient[]>([]);
  public readonly isNew = signal(false);
  public readonly dropdownOpen = signal(false);

  private readonly _imageRawValue = signal<string | null>(null);

  // Signal pour suivre les ingrédients sélectionnés
  private readonly _ingredientsValue = toSignal(
    this.form.get('ingredients')!.valueChanges.pipe(
      startWith(this.form.get('ingredients')?.value || [])
    ),
    { initialValue: [] as string[] }
  );

  public readonly ingredientsDisplay = computed(() => {
    const list = this._ingredientsValue();
    return list && list.length > 0 ? list.join(', ') : 'Cliquer pour sélectionner les ingrédients';
  });

  public readonly imagePreviewUrl = computed(() => {
    const val = this._imageRawValue();
    if (!val) return null;
    return val.startsWith('data:image') ? val : `data:image/png;base64,${val}`;
  });

  private readonly _imageBase64Only = computed(() => {
    return this._imageRawValue()?.replace(/^data:.*;base64,/, '') || '';
  });

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      const namePizza = this.route.snapshot.paramMap.get('namePizza');
      if (!namePizza) {
        this.isNew.set(true);
        this.loadAllIngredients();
      } else {
        this.isNew.set(false);
        this.loadPizza(namePizza);
      }
    } else {
      this.router.navigate(['/menu']);
    }
  }

  loadAllIngredients() {
    this.loaderService.show();
    this.ingredientService.getAll()
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: (data) => this.allIngredients.set(data),
        error: (err) => console.error('Erreur chargement ingrédients', err)
      });
  }

  loadPizza(namePizza: string) {
    this.loaderService.show();
    this.pizzaService.getById(namePizza)
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: (data: Pizza) => {
          this.pizza.set(data);
          if (data) {
            const priceVal = data.pricePizza['normale'];
            this.form.patchValue({
              namePizza: data.namePizza,
              pricePizza: priceVal !== undefined ? priceVal.toFixed(2) : '0.00',
              ingredients: data.ingredients,
              imagePreview: data.image
            });
            this._imageRawValue.set(data.image);
            this.loadAllIngredients();
          }
        },
        error: () => this.router.navigate(['/menu'])
      });
  }

  toggleDropdown() {
    this.dropdownOpen.update(v => !v);
  }

  toggleIngredient(ingredient: Ingredient) {
    const control = this.form.get('ingredients');
    if (!control) return;

    const list: string[] = [...(control.value || [])];
    const index = list.indexOf(ingredient.nameIngredient);

    index > -1 ? list.splice(index, 1) : list.push(ingredient.nameIngredient);

    control.setValue(list);
    control.markAsDirty();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.form.get('imagePreview')?.setValue(result);
      this._imageRawValue.set(result);
    };
    reader.readAsDataURL(input.files[0]);
  }

  onPriceBlur() {
    const control = this.form.get('pricePizza');
    const value = control?.value;

    if (value !== null && value !== undefined && value !== '') {
      const numericValue = parseFloat(value.toString().replace(',', '.'));
      if (!isNaN(numericValue)) {
        control?.setValue(numericValue.toFixed(2), { emitEvent: false });
      }
    }
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.form.invalid) return;

    // Utilisation du "!" ou de valeurs par défaut pour garantir les types à TS
    const namePizza = this.form.get('namePizza')?.value ?? '';
    const pricePizza = this.form.get('pricePizza')?.value ?? '0';
    const ingredients = (this.form.get('ingredients')?.value as string[]) ?? [];
    const image = this._imageBase64Only();

    const numericPrice = parseFloat(pricePizza.toString().replace(',', '.'));
    this.loaderService.show();
    if (this.isNew()) {
      const newPizza: NewPizza = {
        namePizza: toTitleCase(namePizza),
        pricePizza: numericPrice,
        ingredients: ingredients,
        image: image
      };

      this.pizzaService.add(newPizza)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe({
          next: () => this.router.navigate(['/menu']),
          error: (err) => this.error.set(formatErrorMessage(err))
        });
    }
    else {
      const currentPizza = this.pizza();
      if (!currentPizza) return;

      const updatePizza: UpdatedPizza = {
        idPizza: currentPizza.idPizza,
        namePizza: toTitleCase(namePizza),
        pricePizza: numericPrice,
        ingredients: ingredients,
        image: image,
        available: currentPizza.available
      };

      this.pizzaService.update(updatePizza)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe({
          next: () => {
            this.orderService.refreshBasketFromServer();
            this.router.navigate(['/menu']);
          },
          error: (err) => this.popupService.showMessage(formatErrorMessage(err))
        });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.ingredients-container')) {
      this.dropdownOpen.set(false);
    }
  }
}