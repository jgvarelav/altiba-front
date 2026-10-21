import { Component, inject, signal, input, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faLocationDot, faPlus, faPen, faTrash, faXmark, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { ProductoApi } from '../../services/producto-api';
import { AuthService } from '../../../../core/services/auth';
import { Producto } from '../../../../core/models/producto.model';
import { CATEGORIAS } from '../../../../core/models/categorias.const';
import { environment } from '../../../../../environments/environment';
import { ScrollRevealDirective } from '../../../../shared/utils/scroll-reveal.directive';

@Component({
  selector: 'app-emprendimientos-list',
  imports: [RouterLink, FaIconComponent, ScrollRevealDirective],
  templateUrl: './emprendimientos-list.html',
})
export class EmprendimientosList {
  private readonly productoApi = inject(ProductoApi);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

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
    this.router.navigate(['/', 'emprendimientos', producto.documentId]);
  }
}
