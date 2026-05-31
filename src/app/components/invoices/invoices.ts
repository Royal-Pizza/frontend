import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Invoice } from '../../models/invoice.model';
import { ApiService } from '../../services/api/api';
import { LoaderService } from '../../services/loaderService/loader-service';
import { formatErrorMessage } from '../../tools/functions';
import { CommonModule } from '@angular/common';
import { PdfInvoiceService } from '../../services/PdfInvoice/pdf-invoice-service';
import { delay, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-invoices',
  imports: [CommonModule],
  templateUrl: './invoices.html',
  styleUrls: ['./invoices.css']
})
export class InvoicesComponent implements OnInit {
  err: string = '';
  invoices: Invoice[] = [];

  constructor(
    private apiService: ApiService,
    private pdfInvoiceService: PdfInvoiceService,
    private router: Router,
    private loaderService: LoaderService
  ) {
    if (!localStorage.getItem('customer')) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.loaderService.show();

    this.apiService.getAllInvoicesByCustomer()
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
