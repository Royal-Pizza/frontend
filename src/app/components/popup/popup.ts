import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './popup.html',
  styleUrls: ['./popup.css']
})
export class PopupComponent {
  @Input() message: string = ''; // Message à afficher
  @Input() visible: boolean = false; // Gère l’affichage
  @Output() closed = new EventEmitter<void>(); // Événement de fermeture

  closePopup(): void {
    this.visible = false;
    this.closed.emit();
  }
}
