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

    const pageWidth = pdf.internal.pageSize.getWidth();

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

    // === Détails de la commande (centrés horizontalement) ===
    const orders: { [key: string]: AdaptedOrderLine[] } = adaptFormatInvoice(invoice);
    let y = 75;


    pdf.setFontSize(16);
    const title = "Détails de la commande :";
    let textWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - textWidth) / 2, y);
    y += 10;

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(12);
    for (const pizzaName in orders) {
      pdf.setFontSize(14);
      textWidth = pdf.getTextWidth(pizzaName);
      pdf.text(pizzaName, (pageWidth - textWidth) / 2, y);
      y += 8;
      pdf.setFontSize(12);

      for (const line of orders[pizzaName]) {
        const total = line.price * line.quantity;
        const lineText = `- ${line.nameSize} : ${line.quantity} x ${line.price}€ = ${total.toFixed(2)}€`;
        textWidth = pdf.getTextWidth(lineText);
        pdf.text(lineText, (pageWidth - textWidth) / 2, y);
        y += 7;
      }
      y += 5;
    }

    // === Montant total (centré) ===
    // on enlève l'italique
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(16);
    const totalText = `Montant total : ${invoice.totalAmount.toFixed(2)} €`;
    textWidth = pdf.getTextWidth(totalText);
    pdf.text(totalText, (pageWidth - textWidth) / 2, y + 10);

    // === Sauvegarde PDF ===
    pdf.save(`facture_${invoice.idInvoice}.pdf`);
  }
}