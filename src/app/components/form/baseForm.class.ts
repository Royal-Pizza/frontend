import { Directive, OnDestroy, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive()
// Abstract class à étendre
export abstract class BaseFormComponent {
  form!: FormGroup;

  // On passe en signaux pour la réactivité dans le HTML
  submitted = signal(false);
  success = signal<boolean | null>(null);
  error = signal('');
  
  get f() {
    return this.form.controls;
  }
}