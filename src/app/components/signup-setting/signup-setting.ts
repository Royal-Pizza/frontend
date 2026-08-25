import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControlOptions, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../services/api/api';
import { Customer, NewCustomer } from '../../models/customer.model';
import { Router, RouterModule } from '@angular/router';
import { formatErrorMessage } from '../../tools/functions';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup-setting.html',
  styleUrls: ['./signup-setting.css']
})
export class SignupAndSettingComponent implements OnDestroy {

  signupForm: FormGroup;
  submitted = false;
  error = '';
  showPassword = false;
  showConfirmPassword = false;
  successRegister: boolean | null = null;
  customer: Customer | null = null;

  // critères mot de passe
  passwordLength = false;
  passwordHasUpper = false;
  passwordHasLower = false;
  passwordHasSpecial = false;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private apiService: ApiService, private route: Router) {

    this.customer = JSON.parse(localStorage.getItem('customer') || 'null');

    const formOptions: AbstractControlOptions = {
      validators: this.passwordMatchValidator
    };

    this.signupForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, formOptions);

    // --- MODE MODIFICATION ---
    if (this.customer) {
      this.signupForm.patchValue({
        prenom: this.customer.firstName,
        name: this.customer.lastName,
        email: this.customer.emailAddress
      });

      // suppression des validators mot de passe
      this.signupForm.get('password')?.clearValidators();
      this.signupForm.get('confirmPassword')?.clearValidators();

      // supprimer le validator global mismatch
      this.signupForm.setValidators(null);

      this.signupForm.updateValueAndValidity();
    }

    // suivi dynamique des critères
    this.signupForm.get('password')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        value = value || '';

        this.passwordLength = value.length >= 8;
        this.passwordHasUpper = /[A-Z]/.test(value);
        this.passwordHasLower = /[a-z]/.test(value);
        this.passwordHasSpecial = /[!@#$%^&.*]/.test(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // mot de passe fort
  passwordStrengthValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value || '';

    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&.*]/.test(value);
    const hasMinLength = value.length >= 8;

    return hasUpper && hasLower && hasSpecial && hasMinLength ? null : { weakPassword: true };
  };

  // confirmation du mot de passe
  passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  };

  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.signupForm.invalid) return;

    // --- CREATION ---
    if (!this.customer) {
      const newCustomer: NewCustomer = {
        firstName: this.f['prenom'].value,
        lastName: this.f['name'].value,
        emailAddress: this.f['email'].value,
        password: this.f['password'].value
      };

      this.apiService.createCustomer(newCustomer).subscribe({
        next: (data: Customer) => {
          this.successRegister = true;
          console.log('Inscription réussie', data);
        },
        error: (msg) => {
          this.successRegister = false;
          console.error('Erreur lors de l’inscription : ', msg);
          this.error = formatErrorMessage(msg);
        }
      });
      return;
    }

    // --- MODIFICATION ---
    const updatedCustomer: Customer = {
      idCustomer: this.customer.idCustomer,
      firstName: this.f['prenom'].value,
      lastName: this.f['name'].value,
      emailAddress: this.f['email'].value,
      isAdmin: this.customer.isAdmin,
      wallet: this.customer.wallet
    };

    this.apiService.updateCustomer(updatedCustomer).subscribe({
      next: (response) => {
        this.successRegister = true;
        localStorage.setItem('authToken', response.token);
        console.log('Mise à jour réussie', response);
      },
      error: (msg) => {
        this.successRegister = false;
        console.error('Erreur lors de la mise à jour : ', msg);
        this.error = formatErrorMessage(msg);
      }
    });
  }

  deleteAccount() {
    this.apiService.deleteCustomer().subscribe({
      next: () => {
        console.log("compte supprimé avec succès")
        this.apiService.logoutCustomer().subscribe({
          next: () => {
            console.log('Déconnexion réussi');
          },
          error: (err) => {
            console.error('Erreur lors du logout :', err);
          },
        });
      },
      error: (msg) => {
        this.successRegister = false;
        console.error('Erreur lors de la mise à jour : ', msg);
        this.error = formatErrorMessage(msg);
      }
    });
  }
}
