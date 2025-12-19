// src/app/components/update-password/update-password.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../baseForm.class';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/httpRequest/customer/customer-service';

@Component({
  selector: 'app-update-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-password.html',
  styleUrls: ['./update-password.css']
})
export class UpdatePasswordComponent extends BaseFormComponent {
  showNewPassword = false;
  showConfirmPassword = false;

  passwordLength = false;
  passwordHasUpper = false;
  passwordHasLower = false;
  passwordHasSpecial = false;

  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService)
  private router = inject(Router);
  
  constructor() {
    super();

    if (!localStorage.getItem('customer')) {
      this.router.navigate(['/login']);
    }

    this.form = this.fb.group(
      {
        newPassword: ['', [Validators.required, this.passwordStrengthValidator]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );

    this.form.get('newPassword')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        value = value || '';
        this.passwordLength = value.length >= 8;
        this.passwordHasUpper = /[A-Z]/.test(value);
        this.passwordHasLower = /[a-z]/.test(value);
        this.passwordHasSpecial = /[!@#$%^&.*]/.test(value);
      });
  }

  // Mot de passe fort
  passwordStrengthValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&.*]/.test(value);
    const hasMinLength = value.length >= 8;
    return hasUpper && hasLower && hasSpecial && hasMinLength ? null : { weakPassword: true };
  };

  // Mots de passe identiques
  passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const p1 = form.get('newPassword')?.value;
    const p2 = form.get('confirmPassword')?.value;
    return p1 === p2 ? null : { mismatch: true };
  };

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (!this.form || this.form.invalid) return;

    const newPassword = this.form.get('newPassword')?.value;

    this.customerService.changePassword(newPassword).subscribe({
      next: () => {
        this.success = true;
      },
      error: (msg) => {
        this.success = false;
        this.error = msg; // ou formatErrorMessage(msg) si tu utilises la fonction
      }
    });
  }
}
