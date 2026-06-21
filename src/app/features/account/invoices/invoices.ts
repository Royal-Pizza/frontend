import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { Invoice } from '../../../core/models/invoice.model';
import { LoaderService } from '../../../shared/services/loader-service';
import { PurchaseService } from '../../../core/services/purchase-service';
import { PdfInvoiceService } from '../../../shared/services/pdf-invoice-service';
import { formatErrorMessage } from '../../../shared/utils/functions';
import { AuthService } from '../../../core/auth/auth-service';

@Component({
  selector: 'app-invoices',
  standalone: true, // Toujours privilégier le standalone en Angular 18+
  imports: [CommonModule], // On garde CommonModule pour les PIPES (date, number)
  templateUrl: './invoices.html',
  styleUrls: ['./invoices.css'],
})
export class InvoicesComponent implements OnInit {
  private readonly purchaseService = inject(PurchaseService);
  private readonly pdfInvoiceService = inject(PdfInvoiceService);
  private readonly loaderService = inject(LoaderService);

  public readonly err: WritableSignal<string> = signal('');
  public readonly invoices: WritableSignal<Invoice[]> = signal([]);

  ngOnInit(): void {
    this.loadInvoices();
  }

  private loadInvoices(): void {
    this.loaderService.show();

    this.purchaseService
      .getAllInvoicesByCustomer()
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: (data) => {
          this.err.set('');
          this.invoices.set(data);
        },
        error: (error) => {
          this.err.set(formatErrorMessage(error));
        },
      });
  }

  downloadPDF(invoice: Invoice): void {
    this.pdfInvoiceService.generatePDF(invoice);
  }
}
