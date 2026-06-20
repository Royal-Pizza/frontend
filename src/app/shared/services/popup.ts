import { Injectable, signal, Signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private _message: WritableSignal<string> = signal<string>('');
  public readonly message: Signal<string> = this._message.asReadonly();

  /**
   * Affiche une popup avec le message spécifié
   */
  showMessage(message: string): void {
    this._message.set(message);
  }

  /**
   * Ferme la popup en vidant le message
   */
  closeMessage(): void {
    this._message.set('');
  }
}