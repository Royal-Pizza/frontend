import { Component, OnInit, inject, signal, computed, Signal, WritableSignal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

import { BaseFormComponent } from '../../../shared/classes/baseForm.class';
import { CustomerService } from '../../../core/services/customer-service';
import { formatErrorMessage } from '../../../shared/utils/functions';
import { AuthService } from '../../../core/auth/auth-service';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-password.html',
  styleUrls: ['./update-password.css'],
})
export class UpdatePasswordComponent extends BaseFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public readonly showNewPassword = signal(false);
  public readonly showConfirmPassword = signal(false);

  // --- 1. INITIALISER LE FORMULAIRE ICI DIRECTEMENT ---
  public override form = this.fb.group(
    {
      newPassword: [
        '',
        [
          Validators.required,
          (control: AbstractControl) => this.passwordStrengthValidator(control),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: (form: AbstractControl) => this.passwordMatchValidator(form) },
  );

  // --- 2. MAINTENANT LE SIGNAL PEUT LIRE LE FORMULAIRE ---
  private readonly _passwordValue = toSignal(this.form.get('newPassword')!.valueChanges, {
    initialValue: '',
  });

  public readonly passwordCriteria = computed(() => {
    const val = this._passwordValue() || '';
    return {
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      special: /[!@#$%^&.*]/.test(val),
    };
  });

  constructor() {
    super();
  }

  // Validateurs (simplifiés pour éviter les erreurs de contexte 'this')
  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value || '';
    const isValid =
      /[A-Z]/.test(val) && /[a-z]/.test(val) && /[!@#$%^&.*]/.test(val) && val.length >= 8;
    return isValid ? null : { weakPassword: true };
  }

  private passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const p1 = form.get('newPassword')?.value;
    const p2 = form.get('confirmPassword')?.value;
    return p1 === p2 ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.error.set('');
    if (this.form.invalid) return;

    const newPassword = this.form.get('newPassword')?.value;
    this.customerService.changePassword(newPassword!).subscribe({
      next: () => {
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/settings']), 2000);
      },
      error: (err) => this.error.set(formatErrorMessage(err)),
    });
  }

  toggleVisibility(field: 'new' | 'confirm'): void {
    if (field === 'new') this.showNewPassword.update((v) => !v);
    else this.showConfirmPassword.update((v) => !v);
  }
}
