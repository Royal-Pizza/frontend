import { TestBed } from '@angular/core/testing';

import { PdfInvoiceService } from './pdf-invoice-service';

describe('PdfInvoiceService', () => {
  let service: PdfInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
