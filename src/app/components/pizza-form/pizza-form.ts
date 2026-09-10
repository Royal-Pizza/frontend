import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BaseFormComponent } from '../../classes/baseForm.class';
import { ApiService } from '../../services/api/api';
import { Ingredient } from '../../models/ingredient.model';
import { NewPizza, Pizza, UpdatedPizza } from '../../models/pizza.model';
import { LoaderService } from '../../services/loaderService/loader-service';
import { finalize } from 'rxjs';
import { toTitleCase, formatErrorMessage } from '../../tools/functions';
import { PopupService } from '../../services/popup/popup';
import { OrderService } from '../../services/order/order-service';

@Component({
  selector: 'app-pizza-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './pizza-form.html',
  styleUrls: ['./pizza-form.css']
})
export class PizzaFormComponent extends BaseFormComponent implements OnInit {

  pizza: Pizza | null = null;
  allIngredients: Ingredient[] = [];

  isNew = false;
  ingredientsDisplay = 'Cliquer pour sélectionner les ingrédients';
  dropdownOpen = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiService,
    private loader: LoaderService,
    private popupService: PopupService,
    private orderService: OrderService,
    private router: Router
  ) {
    super();

    this.form = this.fb.group({
      namePizza: ['', [Validators.required, Validators.minLength(2)]],
      pricePizza: ['', [Validators.required, this.positiveNumberValidator]],
      ingredients: [[], [Validators.required]],
      imagePreview: [null, [Validators.required]] // Corrected
    });
  }

  ngOnInit(): void {
    if (!!localStorage.getItem('customer')) {
      const customer = JSON.parse(localStorage.getItem('customer')!); // on met un ! car on est sûr que ce n'est pas null
      if (customer.isAdmin) {
        const namePizza = this.route.snapshot.paramMap.get('namePizza');
        if (!namePizza) {
          this.isNew = true;
          this.loadAllIngredients();
        } else {
          this.isNew = false;
          this.loadPizza(namePizza);
        }
      }
      else {
        this.router.navigate(['/menu']);
      }
    }
    else {
      this.router.navigate(['/menu']);
    }

  }

  loadAllIngredients() {
    this.loader.show();
    this.apiService.getAllIngredients()
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: (data) => this.allIngredients = data,
        error: (err) => console.error('Erreur chargement ingrédients', err)
      });
  }

  loadPizza(namePizza: string | null) {
    this.loader.show();
    this.apiService.getPizzaById(namePizza)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: (data) => {
          this.pizza = data;

          console.log('Pizza loaded:', this.pizza);
          if (this.pizza) {
            console.log('Loaded pizza:', this.pizza);
            this.form.patchValue({
              namePizza: this.pizza.namePizza,
              pricePizza: parseFloat(this.pizza.pricePizza['normale']?.toFixed(2) || '0.00'),
              ingredients: this.pizza.ingredients,
              imagePreview: this.pizza.image
            });

            this.ingredientsDisplay = this.pizza.ingredients.join(', ');

            if (this.pizza.image) {
              this.form.get('imagePreview')?.setValue(this.pizza.image); // Corrected
            }

            this.loadAllIngredients();
          }
        },
        error: (err) => {
          if (namePizza !== null) {
            console.log('Pizza non trouvée, redirection vers le menu');
            this.router.navigate(['/menu']);
          }
        }
      });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleIngredient(ingredient: Ingredient) {
    const list: string[] = this.form.get('ingredients')?.value || [];
    const index = list.indexOf(ingredient.nameIngredient);

    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(ingredient.nameIngredient);
    }

    this.form.get('ingredients')?.setValue(list);
    this.ingredientsDisplay = list.join(', ');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const input = document.getElementById('ingredientsInput');
    const dropdown = document.querySelector('.ingredients-dropdown');

    if (dropdown && input) {
      if (!dropdown.contains(target) && target !== input) {
        this.dropdownOpen = false;
      }
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const imageFile = input.files[0];
    const reader = new FileReader();

    reader.onload = () => this.form.get('imagePreview')?.setValue(reader.result as string); // Corrected

    reader.readAsDataURL(imageFile);
  }

  get imagePreviewUrl(): string | null {
    const value = this.form.get('imagePreview')?.value; // Corrected
    if (!value) return null;
    return value.startsWith('data:image') ? value : 'data:image/png;base64,' + value;
  }

  positiveNumberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = parseFloat(control.value);
    return !isNaN(value) && value > 0 ? null : { positiveNumber: true };
  };

  onPriceBlur() {
    const control = this.form.get('pricePizza');
    const value = parseFloat(control?.value || '0'); // Safe conversion
    if (!isNaN(value)) {
      control?.setValue(value.toFixed(2), { emitEvent: false });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const base64Image = this.form.get('imagePreview')?.value;
    const imageBase64Only = base64Image?.replace(/^data:.*;base64,/, '');

    const formValue = this.form.value;
    if (this.isNew) {
      const newPizza: NewPizza = {
        namePizza: toTitleCase(formValue.namePizza),
        pricePizza: parseFloat(formValue.pricePizza || '0'),
        ingredients: formValue.ingredients,
        image: imageBase64Only
      };
      this.apiService.addPizza(newPizza).subscribe({
        next: () => {
          console.log('Pizza added successfully');
          this.router.navigate(['/menu']);
        },
        error: (error) => {
          console.error('Error adding pizza', error);
        }
      });
    } else {
      if (!this.pizza) return;
      const updatePizza: UpdatedPizza = {
        idPizza: this.pizza.idPizza,
        namePizza: toTitleCase(formValue.namePizza),
        pricePizza: parseFloat(formValue.pricePizza || '0'),
        ingredients: formValue.ingredients,
        image: formValue.imagePreview,
        available: this.pizza.available
      };
      this.apiService.updatePizza(updatePizza).subscribe({
        next: (response) => {
          console.log('Pizza updated successfully', response);
          this.router.navigate(['/menu']);
          this.orderService.refreshBasketFromServer(); // Met à jour le panier
        },
        error: (error) => {
          this.popupService.showMessage('Erreur !\n' + formatErrorMessage(error));
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/menu']);
  }
}