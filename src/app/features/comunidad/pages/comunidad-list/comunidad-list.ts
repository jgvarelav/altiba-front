import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faComments,
  faUserGroup,
  faArrowRight,
  faQuoteRight,
} from '@fortawesome/free-solid-svg-icons';
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
  readonly faArrowRight = faArrowRight;
  readonly faQuoteRight = faQuoteRight;

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

  /** Stable brand color per author, so each person's avatar is recognizable. */
  avatarColor(username: string | undefined): string {
    const colors = ['#6fa834', '#d9a441', '#29abe2', '#7b5ea7', '#1f3d2b', '#e0794a'];
    let h = 0;
    for (const char of username ?? '') {
      h = (h * 31 + char.charCodeAt(0)) >>> 0;
    }
    return colors[h % colors.length];
  }
}
