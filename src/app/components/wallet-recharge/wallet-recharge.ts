// src/app/components/wallet-recharge/wallet-recharge.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../services/api/api';
import { LoaderService } from '../../services/loaderService/loader-service';
import { BaseFormComponent } from '../../classes/baseForm.class';
import { delay, finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet-recharge',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wallet-recharge.html',
  styleUrls: ['./wallet-recharge.css']
})
export class WalletRechargeComponent extends BaseFormComponent {
  message = '';

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private loaderService: LoaderService) {
    super();
    if (!localStorage.getItem('customer')) {
      this.router.navigate(['/login']);
    }
    this.form = this.fb.group({
      amount: ['', [Validators.required, this.minAmountValidator(9.99), this.twoDecimalsValidator]]
    });

    this.form.get('amount')?.valueChanges
      .pipe(takeUntil(this.destroy$)) //ici  
      .subscribe(() => {
        this.success = null;
        this.message = '';
      });
  }


  minAmountValidator(min: number) {
    return (control: AbstractControl) => {
      const value = parseFloat(control.value);
      return !isNaN(value) && value > min ? null : { minAmount: { requiredMin: min } };
    };
  }

  twoDecimalsValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(value) ? null : { twoDecimals: true };
  }

  onSubmit() {
    this.submitted = true;
    this.message = '';
    this.success = null;

    if (!this.form || this.form.invalid) return;

    const amount = parseFloat(this.form.get('amount')?.value ?? '0');

    this.loaderService.show();
    this.apiService.rechargeWallet(amount)
      .pipe(
        delay(5000), // simule 5 secondes minimum
        finalize(() => this.loaderService.hide())
      )
      .subscribe({
        next: () => {
          this.success = true;
          this.message = `🎉 Portefeuille rechargé avec succès de ${amount.toFixed(2)} € !`;

          setTimeout(() => {
            this.form?.reset();
          }, 2000);
        },
        error: (msg) => {
          this.success = false;
          this.message = `❌ Échec de la recharge : ${msg}`;
        }
      });
  }
}
