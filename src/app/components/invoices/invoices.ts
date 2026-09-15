import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Invoice } from '../../models/invoice.model';
import { LoaderService } from '../../services/tools/loader/loader-service';
import { formatErrorMessage } from '../../utils/functions';
import { CommonModule } from '@angular/common';
import { PdfInvoiceService } from '../../services/PdfInvoice/pdf-invoice-service';
import { delay, finalize } from 'rxjs/operators';
import { PurchaseService } from '../../services/httpRequest/purchase/purchase-service';

@Component({
  selector: 'app-invoices',
  imports: [CommonModule],
  templateUrl: './invoices.html',
  styleUrls: ['./invoices.css']
})
export class InvoicesComponent implements OnInit {
  err: string = '';
  invoices: Invoice[] = [];

    private purchaseService = inject(PurchaseService);
    private pdfInvoiceService = inject(PdfInvoiceService);
    private router = inject(Router);
    private loaderService = inject(LoaderService);
  constructor(
  ) {
    if (!localStorage.getItem('customer')) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.loaderService.show();

    const idCustomer = JSON.parse(localStorage.getItem('customer') || '{}').idCustomer;
    this.purchaseService.getAllInvoicesByCustomer()
      .pipe(
        finalize(() => this.loaderService.hide())
      )
      .subscribe({
        next: (invoices) => {
          this.err = '';
          this.invoices = invoices;
          console.log('Invoices loaded:', this.invoices);
        },
        error: (error) => {
          this.err = formatErrorMessage(error);
          console.error(this.err);
        }
      });
  }

  downloadPDF(invoice: Invoice) {
    this.pdfInvoiceService.generatePDF(invoice);
  }
}
