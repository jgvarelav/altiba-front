import { Component, inject, signal, input, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faLocationDot, faPlus, faPen, faTrash, faXmark, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { ProductoApi } from '../../services/producto-api';
import { AuthService } from '../../../../core/services/auth';
import { Producto } from '../../../../core/models/producto.model';
import { CATEGORIAS } from '../../../../core/models/categorias.const';
import { blocksToText } from '../../../../core/utils/strapi-blocks';
import { environment } from '../../../../../environments/environment';
import { ScrollRevealDirective } from '../../../../shared/utils/scroll-reveal.directive';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

@Component({
  selector: 'app-emprendimientos-list',
  imports: [RouterLink, FaIconComponent, ScrollRevealDirective],
  templateUrl: './emprendimientos-list.html',
})
export class EmprendimientosList {
  private readonly productoApi = inject(ProductoApi);
  private readonly authService = inject(AuthService);

  readonly categoria = input<string>();

  readonly apiUrl = environment.apiUrl;
  readonly currentUser = this.authService.currentUser;
  readonly productos = signal<Producto[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly faLocationDot = faLocationDot;
  readonly faPlus = faPlus;
  readonly faPen = faPen;
  readonly faTrash = faTrash;
  readonly faXmark = faXmark;
  readonly faBriefcase = faBriefcase;

  constructor() {
    effect(() => this.load(this.categoria()));
  }

  categoriaLabel(value: string): string {
    return CATEGORIAS.find((c) => c.value === value)?.label ?? value;
  }

  firstImageUrl(producto: Producto): string | null {
    const first = producto.imagenes?.[0];
    return first ? this.apiUrl + first.url : null;
  }

  isOwner(producto: Producto): boolean {
    const userId = this.currentUser()?.id;
    return userId !== undefined && producto.owner?.id === userId;
  }

  load(categoria?: string): void {
    this.loading.set(true);
    this.productoApi.list(categoria).subscribe({
      next: (productos) => {
        this.productos.set(productos);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No pudimos cargar los emprendimientos.');
        this.loading.set(false);
      },
    });
  }

  remove(producto: Producto): void {
    if (!confirm(`¿Eliminar "${producto.nombre}"?`)) {
      return;
    }

    this.productoApi.remove(producto.documentId).subscribe({
      next: () => {
        this.productos.update((list) =>
          list.filter((p) => p.documentId !== producto.documentId),
        );
      },
      error: () => this.errorMessage.set('No pudimos eliminar el producto.'),
    });
  }

  openDetail(producto: Producto): void {
    const images = (producto.imagenes ?? []).map((img) => this.apiUrl + img.url);
    const descripcion = blocksToText(producto.descripcion);

    const sliderHtml =
      images.length > 0
        ? `
          <div class="relative mb-4 h-64 w-full overflow-hidden rounded-lg bg-gray-100">
            <img id="swal-slide-img" src="${images[0]}" class="absolute inset-0 h-full w-full object-cover" />
            ${
              images.length > 1
                ? `
                  <button id="swal-prev" type="button" aria-label="Anterior"
                    style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:32px;height:32px;border-radius:9999px;background:rgba(0,0,0,.5);color:#fff;border:none;cursor:pointer;">‹</button>
                  <button id="swal-next" type="button" aria-label="Siguiente"
                    style="position:absolute;right:8px;top:50%;transform:translateY(-50%);width:32px;height:32px;border-radius:9999px;background:rgba(0,0,0,.5);color:#fff;border:none;cursor:pointer;">›</button>
                  <div id="swal-counter" style="position:absolute;bottom:8px;right:8px;padding:2px 8px;border-radius:9999px;background:rgba(0,0,0,.5);color:#fff;font-size:12px;">1 / ${images.length}</div>
                `
                : ''
            }
          </div>
        `
        : '';

    Swal.fire({
      title: escapeHtml(producto.nombre),
      html: `
        <div style="text-align:left">
          ${sliderHtml}
          <p style="margin:4px 0"><strong>Categoría:</strong> ${escapeHtml(this.categoriaLabel(producto.categoria))}</p>
          ${producto.ubicacion ? `<p style="margin:4px 0"><strong>Ubicación:</strong> ${escapeHtml(producto.ubicacion)}</p>` : ''}
          <p style="margin:4px 0"><strong>Precio:</strong> $${producto.precio.toLocaleString('es-CO')}</p>
          ${descripcion ? `<p style="margin-top:12px;white-space:pre-line">${escapeHtml(descripcion)}</p>` : ''}
          ${producto.numero_contacto ? `<p style="margin-top:12px"><strong>Contacto:</strong> ${escapeHtml(producto.numero_contacto)}</p>` : ''}
        </div>
      `,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#6fa834',
      width: 560,
      didOpen: () => {
        if (images.length <= 1) {
          return;
        }

        let index = 0;
        const img = document.getElementById('swal-slide-img') as HTMLImageElement;
        const counter = document.getElementById('swal-counter');
        const update = (): void => {
          img.src = images[index];
          if (counter) {
            counter.textContent = `${index + 1} / ${images.length}`;
          }
        };

        document.getElementById('swal-prev')?.addEventListener('click', () => {
          index = (index - 1 + images.length) % images.length;
          update();
        });
        document.getElementById('swal-next')?.addEventListener('click', () => {
          index = (index + 1) % images.length;
          update();
        });
      },
    });
  }
}
