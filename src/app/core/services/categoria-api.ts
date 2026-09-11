import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoriaCms } from '../models/categoria.model';

interface StrapiListResponse<T> {
  data: T[];
}

@Injectable({ providedIn: 'root' })
export class CategoriaApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/categorias`;

  // Cached for the lifetime of the app — categorías only change from the Strapi
  // admin panel, not from user activity, so there's no need to refetch on every
  // navigation. Cleared automatically on a full page reload.
  private cache$?: Observable<CategoriaCms[]>;

  list(): Observable<CategoriaCms[]> {
    this.cache$ ??= this.http
      .get<StrapiListResponse<CategoriaCms>>(this.baseUrl, {
        params: { sort: 'orden:asc' },
      })
      .pipe(
        map((res) => res.data),
        shareReplay(1),
      );
    return this.cache$;
  }
}
