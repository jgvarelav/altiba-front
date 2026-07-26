import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faUserGroup,
  faGraduationCap,
  faRocket,
  faLocationDot,
  faImage,
  faLightbulb,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { ProductoApi } from '../emprendimientos/services/producto-api';
import { CategoriaApi } from '../../core/services/categoria-api';
import { EventoApi } from '../../core/services/evento-api';
import { Producto } from '../../core/models/producto.model';
import { CategoriaCms } from '../../core/models/categoria.model';
import { Evento } from '../../core/models/evento.model';
import { CATEGORIAS } from '../../core/models/categorias.const';
import { resolveCategoriaIcon } from '../../core/utils/categoria-icon-map';
import { eventoDiaMes, eventoHora } from '../eventos/utils/evento-format';
import { openEventoDetail } from '../eventos/utils/evento-popup';
import { environment } from '../../../environments/environment';
import { ScrollRevealDirective } from '../../shared/utils/scroll-reveal.directive';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FaIconComponent, ScrollRevealDirective],
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
  readonly faLocationDot = faLocationDot;
  readonly faImage = faImage;
  readonly faCircleInfo = faCircleInfo;

  readonly categorias = signal<CategoriaCms[]>([]);
  readonly featuredProductos = signal<Producto[]>([]);
  readonly proximosEventos = signal<Evento[]>([]);

  constructor() {
    this.productoApi.listDestacados().subscribe((productos) => this.featuredProductos.set(productos));
    this.categoriaApi.list().subscribe((categorias) => this.categorias.set(categorias));
    this.eventoApi.listProximos(2).subscribe((eventos) => this.proximosEventos.set(eventos));
  }

  categoriaIcon(icono: string) {
    return resolveCategoriaIcon(icono);
  }

  categoriaLabel(value: string): string {
    return CATEGORIAS.find((c) => c.value === value)?.label ?? value;
  }

  firstImageUrl(producto: Producto): string | null {
    const first = producto.imagenes?.[0];
    return first ? this.apiUrl + first.url : null;
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
