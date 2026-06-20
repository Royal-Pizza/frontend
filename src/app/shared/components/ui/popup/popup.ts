import { Component, inject, computed, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PopupService } from '../../../services/popup';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './popup.html',
  styleUrls: ['./popup.css']
})
export class PopupComponent {

  private readonly popupService = inject(PopupService);

  public readonly message: Signal<string> = this.popupService.message;
  public readonly isVisible: Signal<boolean> = computed(() => this.message() !== '');

  closePopup(): void {
    this.popupService.closeMessage();
  }
}