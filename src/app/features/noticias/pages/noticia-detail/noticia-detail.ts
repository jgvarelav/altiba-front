import { Component, inject, input, signal, effect } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { NoticiaApi } from '../../../../core/services/noticia-api';
import { Noticia } from '../../../../core/models/noticia.model';
import { environment } from '../../../../../environments/environment';
import { noticiaFechaLarga } from '../../utils/noticia-format';

@Component({
  selector: 'app-noticia-detail',
  imports: [RouterLink, FaIconComponent],
  templateUrl: './noticia-detail.html',
})
export class NoticiaDetail {
  private readonly noticiaApi = inject(NoticiaApi);

  readonly documentId = input.required<string>();

  readonly apiUrl = environment.apiUrl;
  readonly noticia = signal<Noticia | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly faArrowLeft = faArrowLeft;
  readonly faNewspaper = faNewspaper;

  constructor() {
    effect(() => {
      this.loading.set(true);
      this.noticiaApi.getByDocumentId(this.documentId()).subscribe({
        next: (noticia) => {
          this.noticia.set(noticia);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('No pudimos cargar esta noticia.');
          this.loading.set(false);
        },
      });
    });
  }

  fechaLarga(fecha: string): string {
    return noticiaFechaLarga(fecha);
  }

  imagenUrl(noticia: Noticia): string | null {
    return noticia.imagen ? this.apiUrl + noticia.imagen.url : null;
  }
}
