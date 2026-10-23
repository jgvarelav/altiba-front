import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faMagnifyingGlass,
  faBriefcase,
  faCalendarDays,
  faNewspaper,
  faComments,
  faLocationDot,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {
  EMPTY_RESULTS,
  SearchResults,
  SearchService,
  totalResults,
} from '../../../../core/services/search';
import { Evento } from '../../../../core/models/evento.model';
import { Noticia } from '../../../../core/models/noticia.model';
import { environment } from '../../../../../environments/environment';
import { eventoDiaMes, eventoHora } from '../../../eventos/utils/evento-format';
import { openEventoDetail } from '../../../eventos/utils/evento-popup';
import { noticiaFechaLarga } from '../../../noticias/utils/noticia-format';
import { ProductoCard } from '../../../emprendimientos/components/producto-card/producto-card';
import { ScrollRevealDirective } from '../../../../shared/utils/scroll-reveal.directive';

type Filtro = 'todo' | keyof SearchResults;

const SUGERENCIAS = ['café', 'artesanías', 'turismo', 'taller', 'feria', 'tecnología'];

@Component({
  selector: 'app-buscar',
  imports: [RouterLink, FaIconComponent, ProductoCard, ScrollRevealDirective],
  templateUrl: './buscar.html',
})
export class Buscar {
  private readonly searchService = inject(SearchService);
  private readonly router = inject(Router);

  /** `?q=` query param, bound via withComponentInputBinding(). */
  readonly q = input<string>('');

  readonly query = signal('');
  readonly filtro = signal<Filtro>('todo');
  private readonly index = toSignal(this.searchService.loadIndex());

  readonly loading = computed(() => this.index() === undefined);
  readonly results = computed(() => {
    const index = this.index();
    return index ? this.searchService.filter(index, this.query()) : EMPTY_RESULTS;
  });
  readonly total = computed(() => totalResults(this.results()));

  readonly filtros = computed(() => {
    const r = this.results();
    return [
      { value: 'todo' as Filtro, label: 'Todo', count: this.total(), icon: faMagnifyingGlass },
      {
        value: 'productos' as Filtro,
        label: 'Emprendimientos',
        count: r.productos.length,
        icon: faBriefcase,
      },
      {
        value: 'eventos' as Filtro,
        label: 'Eventos',
        count: r.eventos.length,
        icon: faCalendarDays,
      },
      {
        value: 'noticias' as Filtro,
        label: 'Noticias',
        count: r.noticias.length,
        icon: faNewspaper,
      },
      {
        value: 'publicaciones' as Filtro,
        label: 'Comunidad',
        count: r.publicaciones.length,
        icon: faComments,
      },
    ];
  });

  readonly sugerencias = SUGERENCIAS;
  readonly faMagnifyingGlass = faMagnifyingGlass;
  readonly faBriefcase = faBriefcase;
  readonly faCalendarDays = faCalendarDays;
  readonly faNewspaper = faNewspaper;
  readonly faComments = faComments;
  readonly faLocationDot = faLocationDot;
  readonly faXmark = faXmark;

  constructor() {
    // Keep the box in sync when the URL changes (e.g. a new search from the navbar).
    effect(() => this.query.set(this.q() ?? ''));
  }

  onInput(value: string): void {
    this.query.set(value);
    this.router.navigate([], { queryParams: { q: value || null }, replaceUrl: true });
  }

  buscar(value: string): void {
    this.onInput(value);
    this.filtro.set('todo');
  }

  show(section: keyof SearchResults): boolean {
    const filtro = this.filtro();
    return (filtro === 'todo' || filtro === section) && this.results()[section].length > 0;
  }

  openEvento(evento: Evento): void {
    openEventoDetail(evento, environment.apiUrl);
  }

  eventoDiaMes(fecha: string) {
    return eventoDiaMes(fecha);
  }

  eventoHora(fecha: string): string {
    return eventoHora(fecha);
  }

  noticiaFecha(noticia: Noticia): string {
    return noticiaFechaLarga(noticia.fecha);
  }

  imagenUrl(item: { imagen?: { url: string } | null }): string | null {
    return item.imagen ? environment.apiUrl + item.imagen.url : null;
  }
}
