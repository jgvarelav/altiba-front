import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CategoriaApi } from '../../../../core/services/categoria-api';
import { CategoriaCms } from '../../../../core/models/categoria.model';
import { resolveCategoriaIcon } from '../../../../core/utils/categoria-icon-map';
import { ScrollRevealDirective } from '../../../../shared/utils/scroll-reveal.directive';

@Component({
  selector: 'app-categorias-list',
  imports: [RouterLink, FaIconComponent, ScrollRevealDirective],
  templateUrl: './categorias-list.html',
})
export class CategoriasList {
  private readonly categoriaApi = inject(CategoriaApi);

  readonly categorias = signal<CategoriaCms[]>([]);

  constructor() {
    this.categoriaApi.list().subscribe((categorias) => this.categorias.set(categorias));
  }

  categoriaIcon(icono: string) {
    return resolveCategoriaIcon(icono);
  }
}
