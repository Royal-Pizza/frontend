import { Directive, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive()
// Abstract class à étendre
export abstract class BaseFormComponent implements OnDestroy {

  form!: FormGroup; 

  submitted = false;
  success: boolean | null = null;
  error = '';

  protected destroy$ = new Subject<void>();

  get f() {
    return this.form.controls;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}