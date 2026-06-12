import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private msgSubject = new BehaviorSubject<string>(''); // message courant
  msgSubject$ = this.msgSubject.asObservable();

  showMessage(message: string) {
    this.msgSubject.next(message);
  }

  closeMessage() {
    this.msgSubject.next('');
  }
}
