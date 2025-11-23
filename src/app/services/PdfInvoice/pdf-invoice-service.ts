import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Invoice } from '../../models/invoice.model';
import { adaptFormatInvoice } from '../../tools/functions';
import { LOGO_URL } from '../../tools/constantes';
import { AdaptedOrderLine } from '../../models/orderLine.model';

@Injectable({
  providedIn: 'root'
})
export class PdfInvoiceService {

  constructor() {}

  async generatePDF(invoice: Invoice) {
    const pdf = new jsPDF();

    // === Logo en haut à droite ===
    const logo = new Image();
    logo.src = LOGO_URL;
    await new Promise(res => logo.onload = res);
    pdf.addImage(logo, 'PNG', 150, 10, 40, 40); // carré

    // === Facture n° en haut à gauche ===
    pdf.setFontSize(22);
    pdf.text(`Facture n°${invoice.idInvoice}`, 10, 20);

    // === Date ===
    pdf.setFontSize(12);
    pdf.text(
      `Date : ${new Date(invoice.date).toLocaleDateString('fr-FR')} à ${new Date(invoice.date).toLocaleTimeString('fr-FR')}`,
      10,
      35
    );

    // === Détails de la commande ===
    const orders : { [key: string]: AdaptedOrderLine[] } = adaptFormatInvoice(invoice);
    let y = 55;
    pdf.setFontSize(16);
    pdf.text("Détails de la commande :", 10, y);
    y += 10;
    pdf.setFontSize(12);

    for (const pizzaName in orders) {
      pdf.setFontSize(14);
      pdf.text(pizzaName, 10, y);
      y += 8;
      pdf.setFontSize(12);

      for (const line of orders[pizzaName]) {
        const total = line.price * line.quantity;
        pdf.text(`- ${line.nameSize} : ${line.quantity} x ${line.price}€ = ${total.toFixed(2)}€`, 15, y);
        y += 7;
      }

      y += 5;
    }

    // === Montant total ===
    pdf.setFontSize(16);
    pdf.text(`Montant total : ${invoice.totalAmount.toFixed(2)} €`, 10, y + 10);

    // === Sauvegarde PDF ===
    pdf.save(`facture_${invoice.idInvoice}.pdf`);
  }
}
