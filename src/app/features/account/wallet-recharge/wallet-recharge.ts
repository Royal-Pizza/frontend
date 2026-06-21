import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BaseFormComponent } from '../../../shared/classes/baseForm.class';
import { LoaderService } from '../../../shared/services/loader-service';
import { CustomerService } from '../../../core/services/customer-service';
import { delay, finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth-service';

@Component({
  selector: 'app-wallet-recharge',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './wallet-recharge.html',
  styleUrls: ['./wallet-recharge.css'],
})
export class WalletRechargeComponent extends BaseFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly loaderService = inject(LoaderService);
  private readonly customerService = inject(CustomerService);
  private readonly authService = inject(AuthService);

  public override form = this.fb.group({
    amount: [null, [Validators.required, Validators.min(1)]],
  });

  onSubmit() {
    this.submitted.set(true);
    this.success.set(null);
    if (!this.form || this.form.invalid) return;
    const amount = parseFloat(this.form.get('amount')?.value ?? '0');

    this.loaderService.show();
    this.customerService
      .rechargeWallet(amount)
      .pipe(
        delay(5000), // simule 5 secondes minimum
        finalize(() => this.loaderService.hide()),
      )
      .subscribe({
        next: (dico) => {
          this.authService.updateLocalCusomerDataFromToken(dico.token);
          this.success.set(true);
          setTimeout(() => {
            this.form?.reset();
          }, 2000);
        },
        error: (msg) => {
          this.success.set(false);
          this.error.set(`❌ Échec de la recharge : ${msg}`);
        },
      });
  }
}
