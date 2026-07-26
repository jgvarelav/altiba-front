import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PublicacionApi } from '../../services/publicacion-api';

@Component({
  selector: 'app-publicacion-form',
  imports: [ReactiveFormsModule],
  templateUrl: './publicacion-form.html',
})
export class PublicacionForm {
  private readonly fb = inject(FormBuilder);
  private readonly publicacionApi = inject(PublicacionApi);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    contenido: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.publicacionApi.create(this.form.getRawValue()).subscribe({
      next: (publicacion) => {
        this.loading.set(false);
        this.router.navigate(['/', 'comunidad', publicacion.documentId]);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.error?.message ?? 'No pudimos publicar tu mensaje.');
      },
    });
  }
}
