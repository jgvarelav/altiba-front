import { Component, inject, signal, input, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus, faPen, faTrash, faXmark, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { ProductoApi } from '../../services/producto-api';
import { AuthService } from '../../../../core/services/auth';
import { Producto } from '../../../../core/models/producto.model';
import { ScrollRevealDirective } from '../../../../shared/utils/scroll-reveal.directive';
import { ProductoCard } from '../../components/producto-card/producto-card';

@Component({
  selector: 'app-emprendimientos-list',
  imports: [RouterLink, FaIconComponent, ScrollRevealDirective, ProductoCard],
  templateUrl: './emprendimientos-list.html',
})
export class EmprendimientosList {
  private readonly productoApi = inject(ProductoApi);
  private readonly authService = inject(AuthService);

  readonly categoria = input<string>();

  readonly currentUser = this.authService.currentUser;
  readonly productos = signal<Producto[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly faPlus = faPlus;
  readonly faPen = faPen;
  readonly faTrash = faTrash;
  readonly faXmark = faXmark;
  readonly faBriefcase = faBriefcase;

  constructor() {
    effect(() => this.load(this.categoria()));
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
        this.productos.update((list) => list.filter((p) => p.documentId !== producto.documentId));
      },
      error: () => this.errorMessage.set('No pudimos eliminar el producto.'),
    });
  }
}
