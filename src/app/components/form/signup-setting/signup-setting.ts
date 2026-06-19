import { Component, OnInit, inject, signal, computed, Signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, map } from 'rxjs'; // Ajout de map

import { BaseFormComponent } from '../baseForm.class';
import { Customer, NewCustomer } from '../../../models/customer.model';
import { formatErrorMessage } from '../../../utils/functions';
import { CustomerService } from '../../../services/httpRequest/customer-service';
import { LoaderService } from '../../../services/tools/loader-service';
import { AuthService } from '../../../services/httpRequest/auth-service';
import { PopupService } from '../../../services/tools/popup';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './signup-setting.html',
  styleUrls: ['./signup-setting.css']
})
export class SignupAndSettingComponent extends BaseFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly customerService = inject(CustomerService);
  private readonly loaderService = inject(LoaderService);
  private readonly popupService = inject(PopupService);
  private readonly router = inject(Router);

  public readonly showPassword = signal<boolean>(false);
  public readonly showConfirmPassword = signal<boolean>(false);

  public readonly customer: Signal<Customer | null> = this.authService.currentUser;

  // --- VALIDATEURS (Déclarés avant le formulaire pour éviter TS2729) ---
  private readonly passwordStrengthValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const isValid = /[A-Z]/.test(value) && /[a-z]/.test(value) && /[!@#$%^&.*]/.test(value) && value.length >= 8;
    return isValid ? null : { weakPassword: true };
  };

  private readonly passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };

  // --- FORMULAIRE ---
  public override form = this.fb.group({
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, this.passwordStrengthValidator]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  // --- SIGNALS ---
  // On ajoute .pipe(map(...)) pour garantir que le flux renvoie toujours une string (règle l'erreur TS2322)
  private readonly _passwordStream: Signal<string> = toSignal(
    this.form.get('password')!.valueChanges.pipe(map(val => val ?? '')),
    { initialValue: '' }
  );

  public readonly passwordCriteria = computed(() => {
    const val = this._passwordStream();
    return {
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      special: /[!@#$%^&.*]/.test(val)
    };
  });

  constructor() {
    super();
  }

  ngOnInit(): void {
    const currentCustomer = this.customer();
    if (currentCustomer) {
      this.form.patchValue({
        prenom: currentCustomer.firstName,
        name: currentCustomer.lastName,
        email: currentCustomer.emailAddress
      });
      this.form.get('password')?.clearValidators();
      this.form.get('confirmPassword')?.clearValidators();
      this.form.setValidators(null); // setValidators permet en genéral de définir plusieurs validateurs à la fois, ici on n'en veut plus
      this.form.updateValueAndValidity(); // updateValueAndValidity permet de recalculer l'état du formulaire
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') this.showPassword.update(v => !v);
    else this.showConfirmPassword.update(v => !v);
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.error.set('');
    this.success.set(null);

    if (this.form.invalid) return;

    this.loaderService.show();
    const val = this.form.getRawValue(); // Plus sûr pour récupérer les valeurs

    if (this.customer()) {
      const updatedData: Customer = {
        ...this.customer()!,
        firstName: val.prenom!,
        lastName: val.name!,
        emailAddress: val.email!
      };

      this.customerService.update(updatedData)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe({
          next: (data) => {
            this.success.set(true);
            this.authService.updateLocalCusomerDataFromToken(data.token)
            this.popupService.showMessage('Profil mis à jour !');
          },
          error: (err) => this.error.set(formatErrorMessage(err))
        });
    } else {
      const newCustomer: NewCustomer = {
        firstName: val.prenom!,
        lastName: val.name!,
        emailAddress: val.email!,
        password: val.password!
      };

      this.customerService.register(newCustomer)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe({
          next: () => {
            this.success.set(true);
            this.popupService.showMessage('Compte créé ! Vous pouvez à présent vous connecter.');
            setTimeout(() => this.router.navigate(['/login']), 2000);
          },
          error: (err) => this.error.set(formatErrorMessage(err))
        });
    }
  }

  deleteAccount(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
      this.loaderService.show();
      this.customerService.delete()
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe({
          next: () => {
            this.authService.logout();
            this.popupService.showMessage('Compte supprimé.');
            this.router.navigate(['/']);
          },
          error: (err) => this.popupService.showMessage(formatErrorMessage(err))
        });
    }
  }
}