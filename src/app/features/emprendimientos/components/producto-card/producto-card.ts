import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faLocationDot, faStar } from '@fortawesome/free-solid-svg-icons';
import { Producto } from '../../../../core/models/producto.model';
import { CategoriaApi } from '../../../../core/services/categoria-api';
import { CATEGORIAS } from '../../../../core/models/categorias.const';
import { resolveCategoriaIcon } from '../../../../core/utils/categoria-icon-map';
import { environment } from '../../../../../environments/environment';

/**
 * Product card shared by the home, the emprendimientos list and the detail page's
 * "Más en …" row. Extra controls (e.g. the owner's edit/delete buttons) can be
 * projected and render below the card's link area.
 */
@Component({
  selector: 'app-producto-card',
  imports: [RouterLink, FaIconComponent],
  templateUrl: './producto-card.html',
  host: { class: 'block h-full' },
})
export class ProductoCard {
  private readonly categorias = toSignal(inject(CategoriaApi).list(), { initialValue: [] });

  readonly producto = input.required<Producto>();

  readonly faArrowRight = faArrowRight;
  readonly faLocationDot = faLocationDot;
  readonly faStar = faStar;

  /** CMS category (color + icon) when loaded; falls back to the static label. */
  readonly categoria = computed(() => {
    const slug = this.producto().categoria;
    const cms = this.categorias().find((c) => c.slug === slug);
    return {
      nombre: cms?.nombre ?? CATEGORIAS.find((c) => c.value === slug)?.label ?? slug,
      color: cms?.color ?? 'var(--color-altiba-green)',
      icon: resolveCategoriaIcon(cms?.icono ?? ''),
    };
  });

  readonly imageUrl = computed(() => {
    const first = this.producto().imagenes?.[0];
    return first ? environment.apiUrl + first.url : null;
  });

  readonly precio = computed(() => `$${Number(this.producto().precio).toLocaleString('es-CO')}`);
}
