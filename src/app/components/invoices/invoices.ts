import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Invoice } from '../../models/invoice.model';
import { ApiService } from '../../services/api/api';
import { formatErrorMessage } from '../../tools/functions';
import { CommonModule } from '@angular/common';
import { PdfInvoiceService } from '../../services/PdfInvoice/pdf-invoice-service';

@Component({
  selector: 'app-invoices',
  imports: [CommonModule],
  templateUrl: './invoices.html',
  styleUrls: ['./invoices.css']
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  constructor(private apiService: ApiService, private pdfInvoiceService: PdfInvoiceService, private router: Router) {
      if (!localStorage.getItem('customer')) {
      this.router.navigate(['/home']);
    }
  }
  ngOnInit(): void {
    this.apiService.getAllInvoicesByCustomer().subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        console.log('Invoices loaded:', this.invoices);
      },
      error: (error) => {
        const err = formatErrorMessage(error);
        console.error(err);
      }
    });
  }

  downloadPDF(invoice: Invoice) {
  this.pdfInvoiceService.generatePDF(invoice);
}
}

