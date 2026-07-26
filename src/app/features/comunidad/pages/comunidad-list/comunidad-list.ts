import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus, faComments, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { PublicacionApi } from '../../services/publicacion-api';
import { AuthService } from '../../../../core/services/auth';
import { Publicacion } from '../../../../core/models/comunidad.model';
import { ScrollRevealDirective } from '../../../../shared/utils/scroll-reveal.directive';

@Component({
  selector: 'app-comunidad-list',
  imports: [CommonModule, RouterLink, FaIconComponent, ScrollRevealDirective],
  templateUrl: './comunidad-list.html',
})
export class ComunidadList {
  private readonly publicacionApi = inject(PublicacionApi);
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  readonly publicaciones = signal<Publicacion[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly faPlus = faPlus;
  readonly faComments = faComments;
  readonly faUserGroup = faUserGroup;

  constructor() {
    this.publicacionApi.list().subscribe({
      next: (publicaciones) => {
        this.publicaciones.set(publicaciones);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No pudimos cargar la comunidad.');
        this.loading.set(false);
      },
    });
  }

  snippet(contenido: string): string {
    return contenido.length > 160 ? contenido.slice(0, 160) + '…' : contenido;
  }
}
