import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../services/api/api';
import { formatErrorMessage } from '../../tools/functions';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-password.html',
  styleUrls: ['./update-password.css']
})
export class UpdatePasswordComponent implements OnDestroy {

  updatePasswordForm: FormGroup;
  submitted = false;
  success: boolean | null = null;
  error = '';

  // show / hide
  showNewPassword = false;
  showConfirmPassword = false;

  // critères mot de passe
  passwordLength = false;
  passwordHasUpper = false;
  passwordHasLower = false;
  passwordHasSpecial = false;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private apiService: ApiService) {

    this.updatePasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, this.passwordStrengthValidator]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );

    // suivi dynamique des critères
    this.updatePasswordForm.get('newPassword')?.valueChanges
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
    const value = control.value || '';
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&.*]/.test(value);
    const hasMinLength = value.length >= 8;

    return hasUpper && hasLower && hasSpecial && hasMinLength ? null : { weakPassword: true };
  };

  // mots de passe identiques
  passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const p1 = form.get('newPassword')?.value;
    const p2 = form.get('confirmPassword')?.value;
    return p1 === p2 ? null : { mismatch: true };
  };

  get f() {
    return this.updatePasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.updatePasswordForm.invalid) return;

    const newPassword = this.f['newPassword'].value;

    this.apiService.changeCustomerPassword(newPassword).subscribe({
      next: () => {
        this.success = true;
      },
      error: (msg) => {
        this.success = false;
        this.error = formatErrorMessage(msg);
      }
    });
  }
}
