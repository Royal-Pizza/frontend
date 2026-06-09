import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PopupService } from '../../services/popup/popup';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './popup.html',
  styleUrls: ['./popup.css']
})
export class PopupComponent implements OnInit, OnDestroy {
  message: string = '';
  visible: boolean = false;
  closed = new EventEmitter<void>();
  private destroy$ = new Subject<void>();

  constructor(private popupService: PopupService) {}

  ngOnInit(): void {
    this.popupService.msgSubject$
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg => {
        this.message = msg;
        this.visible = msg !== '';
      });
  }

  closePopup(): void {
    this.popupService.closeMessage(); // reset message
    this.closed.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
