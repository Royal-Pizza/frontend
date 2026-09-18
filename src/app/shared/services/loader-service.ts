import { Injectable, signal, Signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {


  private _isLoading: WritableSignal<boolean> = signal<boolean>(false);
  public readonly isLoading: Signal<boolean> = this._isLoading.asReadonly();

  /**
   * Affiche le loader global
   */
  show(): void {
    this._isLoading.set(true);
  }

  /**
   * Cache le loader global
   */
  hide(): void {
    this._isLoading.set(false);
  }
}