import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { RouterModule, Router } from '@angular/router';
import { BaseFormComponent } from '../baseForm.class';
import { Customer, NewCustomer } from '../../../models/customer.model';
import { formatErrorMessage } from '../../../utils/functions';
import { AuthService } from '../../../services/httpRequest/auth/auth-service';
import { CustomerService } from '../../../services/httpRequest/customer/customer-service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup-setting.html',
  styleUrls: ['./signup-setting.css']
})
export class SignupAndSettingComponent extends BaseFormComponent {

  showPassword = false;
  showConfirmPassword = false;
  successRegister: boolean | null = null;
  customer: Customer | null = null;

  // critères mot de passe
  passwordLength = false;
  passwordHasUpper = false;
  passwordHasLower = false;
  passwordHasSpecial = false;

  constructor(private fb: FormBuilder,
    private authService: AuthService, private customerService: CustomerService,
    private route: Router) {
    super();

    this.customer = JSON.parse(localStorage.getItem('customer') || 'null');

    const formOptions = { validators: this.passwordMatchValidator };

    this.form = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, formOptions);

    // Mode modification
    if (this.customer) {
      this.form.patchValue({
        prenom: this.customer.firstName,
        name: this.customer.lastName,
        email: this.customer.emailAddress
      });

      this.form.get('password')?.clearValidators();
      this.form.get('confirmPassword')?.clearValidators();
      this.form.setValidators(null);
      this.form.updateValueAndValidity();
    }

    // suivi dynamique mot de passe
    this.form.get('password')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        value = value || '';
        this.passwordLength = value.length >= 8;
        this.passwordHasUpper = /[A-Z]/.test(value);
        this.passwordHasLower = /[a-z]/.test(value);
        this.passwordHasSpecial = /[!@#$%^&.*]/.test(value);
      });
  }

  // Validators
  passwordStrengthValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&.*]/.test(value);
    const hasMinLength = value.length >= 8;

    return hasUpper && hasLower && hasSpecial && hasMinLength ? null : { weakPassword: true };
  };

  passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };


  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (!this.form || this.form.invalid) return;

    // Création
    if (!this.customer) {
      const newCustomer: NewCustomer = {
        firstName: this.form.get('prenom')?.value ?? '', 
        lastName: this.form.get('name')?.value ?? '',
        emailAddress: this.form.get('email')?.value ?? '',
        password: this.form.get('password')?.value ?? ''
      };

      this.customerService.register(newCustomer).subscribe({
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

    // Modification
    const updatedCustomer: Customer = {
      idCustomer: this.customer.idCustomer,
      firstName: this.form.get('prenom')?.value ?? '',
      lastName: this.form.get('name')?.value ?? '',
      emailAddress: this.form.get('email')?.value ?? '',
      isAdmin: this.customer.isAdmin,
      wallet: this.customer.wallet
    };

    this.customerService.update(updatedCustomer).subscribe({
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
    this.customerService.delete().subscribe({
      next: () => {
        console.log("Compte supprimé avec succès");
        this.authService.logout();
      },
      error: (msg) => {
        this.successRegister = false;
        console.error('Erreur lors de la suppression : ', msg);
        this.error = formatErrorMessage(msg);
      }
    });
  }
}
