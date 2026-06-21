import { Directive, OnDestroy, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive()
// Abstract class à étendre
export abstract class BaseFormComponent {
  form!: FormGroup;

  // On passe en signaux pour la réactivité dans le HTML
  submitted: WritableSignal<boolean> = signal(false);
  success: WritableSignal<boolean | null> = signal(null);
  error: WritableSignal<string> = signal('');

  get f() {
    return this.form.controls;
  }
}
