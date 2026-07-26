import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { NoticiaApi } from '../../../../core/services/noticia-api';
import { Noticia } from '../../../../core/models/noticia.model';
import { environment } from '../../../../../environments/environment';
import { noticiaFechaLarga } from '../../utils/noticia-format';
import { ScrollRevealDirective } from '../../../../shared/utils/scroll-reveal.directive';

@Component({
  selector: 'app-noticias-list',
  imports: [RouterLink, FaIconComponent, ScrollRevealDirective],
  templateUrl: './noticias-list.html',
})
export class NoticiasList {
  private readonly noticiaApi = inject(NoticiaApi);

  readonly apiUrl = environment.apiUrl;
  readonly noticias = signal<Noticia[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly faNewspaper = faNewspaper;

  constructor() {
    this.noticiaApi.list().subscribe({
      next: (noticias) => {
        this.noticias.set(noticias);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No pudimos cargar las noticias.');
        this.loading.set(false);
      },
    });
  }

  fechaLarga(fecha: string): string {
    return noticiaFechaLarga(fecha);
  }

  imagenUrl(noticia: Noticia): string | null {
    return noticia.imagen ? this.apiUrl + noticia.imagen.url : null;
  }

  snippet(descripcion: string): string {
    return descripcion.length > 140 ? descripcion.slice(0, 140) + '…' : descripcion;
  }
}
