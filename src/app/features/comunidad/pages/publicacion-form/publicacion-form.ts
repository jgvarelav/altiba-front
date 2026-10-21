import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PublicacionApi } from '../../services/publicacion-api';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-publicacion-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './publicacion-form.html',
})
export class PublicacionForm {
  private readonly fb = inject(FormBuilder);
  private readonly publicacionApi = inject(PublicacionApi);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /** Set by the `:documentId/editar` route — absent when creating a new publicación. */
  readonly documentId = input<string>();
  readonly isEdit = computed(() => !!this.documentId());

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    contenido: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const documentId = this.documentId();
      if (documentId) {
        this.loadForEdit(documentId);
      }
    });
  }

  private loadForEdit(documentId: string): void {
    this.loading.set(true);
    this.publicacionApi.getByDocumentId(documentId).subscribe({
      next: (publicacion) => {
        this.loading.set(false);
        // The backend 403s anyway, but don't let someone else's post open in edit mode.
        if (publicacion.owner?.id !== this.authService.currentUser()?.id) {
          this.router.navigate(['/', 'comunidad', documentId]);
          return;
        }
        this.form.setValue({ titulo: publicacion.titulo, contenido: publicacion.contenido });
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('No pudimos cargar esta publicación.');
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const documentId = this.documentId();
    const request$ = documentId
      ? this.publicacionApi.update(documentId, this.form.getRawValue())
      : this.publicacionApi.create(this.form.getRawValue());

    request$.subscribe({
      next: (publicacion) => {
        this.loading.set(false);
        this.router.navigate(['/', 'comunidad', publicacion.documentId]);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.error?.error?.message ??
            (documentId ? 'No pudimos guardar los cambios.' : 'No pudimos publicar tu mensaje.'),
        );
      },
    });
  }
}
