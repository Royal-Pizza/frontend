import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../services/api/api';
import { LoaderService } from '../../services/loaderService/loader-service';
import { formatErrorMessage } from '../../tools/functions';
import { delay, finalize, pipe } from 'rxjs';

@Component({
  selector: 'app-wallet-recharge',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './wallet-recharge.html',
  styleUrls: ['./wallet-recharge.css']
})
export class WalletRechargeComponent implements OnDestroy {

  rechargeForm: FormGroup;
  submitted = false;
  success: boolean | null = null;
  message = '';
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private apiService: ApiService, private loaderService: LoaderService) {
    this.rechargeForm = this.fb.group({
      amount: ['', [Validators.required, this.minAmountValidator(9.99), this.twoDecimalsValidator]]
    });

    this.rechargeForm.get('amount')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.success = null;
        this.message = '';
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() { return this.rechargeForm.controls; }

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

    if (this.rechargeForm.invalid) return;

    const amount = parseFloat(this.f['amount'].value);

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

        // NE PAS reset submitted pour garder le message visible
        // Réinitialiser le champ amount après un délai pour que l'utilisateur voie le message
        setTimeout(() => {
          this.rechargeForm.reset();
        }, 2000);
      },
      error: (msg) => {
        this.success = false;
        this.message = `❌ Échec de la recharge : ${formatErrorMessage(msg)}`;
      }
    });
  }
}
