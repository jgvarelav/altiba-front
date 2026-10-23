import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faUserGroup,
  faGraduationCap,
  faRocket,
  faLightbulb,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { ProductoApi } from '../emprendimientos/services/producto-api';
import { CategoriaApi } from '../../core/services/categoria-api';
import { EventoApi } from '../../core/services/evento-api';
import { Producto } from '../../core/models/producto.model';
import { CategoriaCms } from '../../core/models/categoria.model';
import { Evento } from '../../core/models/evento.model';
import { resolveCategoriaIcon } from '../../core/utils/categoria-icon-map';
import { eventoDiaMes, eventoHora } from '../eventos/utils/evento-format';
import { openEventoDetail } from '../eventos/utils/evento-popup';
import { environment } from '../../../environments/environment';
import { ScrollRevealDirective } from '../../shared/utils/scroll-reveal.directive';
import { ProductoCard } from '../emprendimientos/components/producto-card/producto-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FaIconComponent, ScrollRevealDirective, ProductoCard],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly productoApi = inject(ProductoApi);
  private readonly categoriaApi = inject(CategoriaApi);
  private readonly eventoApi = inject(EventoApi);

  readonly apiUrl = environment.apiUrl;
  readonly faUserGroup = faUserGroup;
  readonly faUsers = faUsers;
  readonly faLightbulb = faLightbulb;
  readonly faGraduationCap = faGraduationCap;
  readonly faRocket = faRocket;
  readonly faCircleInfo = faCircleInfo;

  readonly categorias = signal<CategoriaCms[]>([]);
  /** The slider only scrolls once there are more categories than fit in one row (4 on desktop). */
  readonly isCategoriasSliding = computed(() => this.categorias().length > 4);
  readonly sliderCategorias = computed(() =>
    this.isCategoriasSliding() ? [...this.categorias(), ...this.categorias()] : this.categorias(),
  );
  readonly featuredProductos = signal<Producto[]>([]);
  readonly proximosEventos = signal<Evento[]>([]);

  constructor() {
    this.productoApi
      .listDestacados()
      .subscribe((productos) => this.featuredProductos.set(productos));
    this.categoriaApi.list().subscribe((categorias) => this.categorias.set(categorias));
    this.eventoApi.listProximos(2).subscribe((eventos) => this.proximosEventos.set(eventos));
  }

  categoriaIcon(icono: string) {
    return resolveCategoriaIcon(icono);
  }

  /** Feeds the pointer position (-1..1 on each axis) to the planet's CSS 3D tilt. */
  tiltPlanet(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--px', (((event.clientX - rect.left) / rect.width) * 2 - 1).toFixed(3));
    el.style.setProperty('--py', (((event.clientY - rect.top) / rect.height) * 2 - 1).toFixed(3));
  }

  resetPlanetTilt(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement;
    el.style.removeProperty('--px');
    el.style.removeProperty('--py');
  }

  eventoDiaMes(fecha: string) {
    return eventoDiaMes(fecha);
  }

  eventoHora(fecha: string): string {
    return eventoHora(fecha);
  }

  openEvento(evento: Evento): void {
    openEventoDetail(evento, this.apiUrl);
  }
}
