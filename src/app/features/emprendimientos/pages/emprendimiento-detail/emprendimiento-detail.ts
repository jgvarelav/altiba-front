import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
  faEnvelope,
  faLocationDot,
  faPen,
  faPhone,
  faStore,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { ProductoApi } from '../../services/producto-api';
import { AuthService } from '../../../../core/services/auth';
import { Producto } from '../../../../core/models/producto.model';
import { CATEGORIAS } from '../../../../core/models/categorias.const';
import { blocksToText } from '../../../../core/utils/strapi-blocks';
import { contactoHref } from '../../../../shared/utils/contacto-href';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-emprendimiento-detail',
  imports: [RouterLink, FaIconComponent],
  templateUrl: './emprendimiento-detail.html',
})
export class EmprendimientoDetail {
  private readonly productoApi = inject(ProductoApi);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly documentId = input.required<string>();

  readonly apiUrl = environment.apiUrl;
  readonly producto = signal<Producto | null>(null);
  readonly relacionados = signal<Producto[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly imagenActual = signal(0);

  readonly imagenes = computed(() =>
    (this.producto()?.imagenes ?? []).map((img) => this.apiUrl + img.url),
  );
  readonly descripcion = computed(() => blocksToText(this.producto()?.descripcion));
  readonly isOwner = computed(() => {
    const userId = this.authService.currentUser()?.id;
    return userId !== undefined && this.producto()?.owner?.id === userId;
  });
  readonly contacto = computed(() => {
    const value = this.producto()?.numero_contacto?.trim();
    if (!value) return null;
    const href = contactoHref(value);
    const tipo = !href
      ? 'texto'
      : href.startsWith('https://wa.me/')
        ? 'whatsapp'
        : href.startsWith('mailto:')
          ? 'correo'
          : 'enlace';
    return { value, href, tipo };
  });

  readonly faArrowLeft = faArrowLeft;
  readonly faChevronLeft = faChevronLeft;
  readonly faChevronRight = faChevronRight;
  readonly faEnvelope = faEnvelope;
  readonly faLocationDot = faLocationDot;
  readonly faPen = faPen;
  readonly faPhone = faPhone;
  readonly faStore = faStore;
  readonly faTrash = faTrash;
  readonly faUser = faUser;
  readonly faWhatsapp = faWhatsapp;

  constructor() {
    effect(() => this.load(this.documentId()));
  }

  private load(documentId: string): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.imagenActual.set(0);

    this.productoApi.getByDocumentId(documentId).subscribe({
      next: (producto) => {
        this.producto.set(producto);
        this.loading.set(false);
        this.loadRelacionados(producto);
      },
      error: () => {
        this.errorMessage.set('No encontramos este emprendimiento.');
        this.loading.set(false);
      },
    });
  }

  private loadRelacionados(producto: Producto): void {
    this.productoApi.list(producto.categoria).subscribe((productos) =>
      this.relacionados.set(
        productos.filter((p) => p.documentId !== producto.documentId).slice(0, 4),
      ),
    );
  }

  categoriaLabel(value: string): string {
    return CATEGORIAS.find((c) => c.value === value)?.label ?? value;
  }

  precio(value: number): string {
    return `$${Number(value).toLocaleString('es-CO')}`;
  }

  firstImageUrl(producto: Producto): string | null {
    const first = producto.imagenes?.[0];
    return first ? this.apiUrl + first.url : null;
  }

  anterior(): void {
    const total = this.imagenes().length;
    this.imagenActual.update((i) => (i - 1 + total) % total);
  }

  siguiente(): void {
    this.imagenActual.update((i) => (i + 1) % this.imagenes().length);
  }

  remove(): void {
    const producto = this.producto();
    if (!producto || !confirm(`¿Eliminar "${producto.nombre}"?`)) {
      return;
    }
    this.productoApi.remove(producto.documentId).subscribe({
      next: () => this.router.navigateByUrl('/emprendimientos'),
      error: () => this.errorMessage.set('No pudimos eliminar el emprendimiento.'),
    });
  }
}
