import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControlOptions, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../services/api/api';
import { Customer, NewCustomer } from '../../models/customer.model';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})

export class SignupComponent implements OnDestroy {
  signupForm: FormGroup;
  submitted = false;
  error: string = '';
  showPassword = false;
  showConfirmPassword = false;
  successRegister: boolean | null = null; // Pour afficher le message de succès

  // Pour l'affichage dynamique des critères
  passwordLength = false;
  passwordHasUpper = false;
  passwordHasLower = false;
  passwordHasSpecial = false;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {

    // Redirection si déjà connecté
    if (localStorage.getItem('authToken')) {
      this.router.navigate(['/home']);
    }
    const formOptions: AbstractControlOptions = {
      validators: [this.passwordMatchValidator]
    };

    this.signupForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, formOptions);

    // Suivi dynamique des critères de mot de passe
    this.signupForm.get('password')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.passwordLength = (value?.length || 0) >= 8;
        this.passwordHasUpper = /[A-Z]/.test(value);
        this.passwordHasLower = /[a-z]/.test(value);
        this.passwordHasSpecial = /[!@#$%^&.*]/.test(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(); // Indique la fin des abonnements
    this.destroy$.complete(); // Nettoie le sujet
  }

  // Validator mot de passe fort
  passwordStrengthValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value.trim() || '';
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&.*]/.test(value);
    const hasMinLength = value.length >= 8;

    return hasUpper && hasLower && hasSpecial && hasMinLength ? null : { weakPassword: true };
  };

  // Validator confirmation mot de passe
  passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword ? null : { mismatch: true };
  };

  get f() {
    return this.signupForm.controls as { [key: string]: AbstractControl };
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    if (this.signupForm.invalid) return;

    const newCustomer: NewCustomer = {
      firstName: this.f['prenom'].value,
      lastName: this.f['name'].value,
      emailAddress: this.f['email'].value,
      password: this.f['password'].value
    };

    this.apiService.createCustomer(newCustomer).subscribe({
      next: (data: Customer) => {
        this.successRegister = true; // Inscription réussie
        console.log('Inscription réussie', data);
      },
      error: (msg) => {
        this.successRegister = false; // Inscription échouée
        console.error('Erreur lors de l\'inscription : ', msg);
        this.error = msg.error?.message || 'Erreur lors de l\'inscription';
      }
    });
    
  }
}