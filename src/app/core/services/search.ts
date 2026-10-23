import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, of } from 'rxjs';
import { ProductoApi } from '../../features/emprendimientos/services/producto-api';
import { PublicacionApi } from '../../features/comunidad/services/publicacion-api';
import { EventoApi } from './evento-api';
import { NoticiaApi } from './noticia-api';
import { Producto } from '../models/producto.model';
import { Evento } from '../models/evento.model';
import { Noticia } from '../models/noticia.model';
import { Publicacion } from '../models/comunidad.model';
import { CATEGORIAS } from '../models/categorias.const';

export interface SearchResults {
  productos: Producto[];
  eventos: Evento[];
  noticias: Noticia[];
  publicaciones: Publicacion[];
}

export const EMPTY_RESULTS: SearchResults = {
  productos: [],
  eventos: [],
  noticias: [],
  publicaciones: [],
};

/** Lowercase and strip accents, so "cafe" finds "Café" and "artesanias" finds "Artesanías". */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export function totalResults(results: SearchResults): number {
  return (
    results.productos.length +
    results.eventos.length +
    results.noticias.length +
    results.publicaciones.length
  );
}

/**
 * Site-wide search. The catalog is small, so it loads every searchable collection once and
 * filters in the browser — that gives accent-insensitive matching, which Strapi's
 * `$containsi` (a plain ILIKE on Postgres) can't do.
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly productoApi = inject(ProductoApi);
  private readonly eventoApi = inject(EventoApi);
  private readonly noticiaApi = inject(NoticiaApi);
  private readonly publicacionApi = inject(PublicacionApi);

  /** Fetches everything searchable; a failing collection just contributes no results. */
  loadIndex(): Observable<SearchResults> {
    return forkJoin({
      productos: this.productoApi.list().pipe(catchError(() => of([]))),
      eventos: this.eventoApi.list().pipe(catchError(() => of([]))),
      noticias: this.noticiaApi.list().pipe(catchError(() => of([]))),
      publicaciones: this.publicacionApi.list().pipe(catchError(() => of([]))),
    });
  }

  /** Every word of the query must appear somewhere in the item's searchable text. */
  filter(index: SearchResults, query: string): SearchResults {
    const words = normalizeText(query).split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return EMPTY_RESULTS;
    }
    const matches = (...fields: (string | null | undefined)[]) => {
      const haystack = normalizeText(fields.filter(Boolean).join(' '));
      return words.every((word) => haystack.includes(word));
    };

    return {
      productos: index.productos.filter((p) =>
        matches(
          p.nombre,
          p.ubicacion,
          CATEGORIAS.find((c) => c.value === p.categoria)?.label,
          p.owner?.username,
          p.descripcion?.flatMap((block) => block.children.map((child) => child.text)).join(' '),
        ),
      ),
      eventos: index.eventos.filter((e) => matches(e.titulo, e.descripcion, e.ubicacion)),
      noticias: index.noticias.filter((n) => matches(n.titulo, n.descripcion)),
      publicaciones: index.publicaciones.filter((p) =>
        matches(p.titulo, p.contenido, p.owner?.username),
      ),
    };
  }
}
