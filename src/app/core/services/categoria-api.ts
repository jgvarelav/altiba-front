import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoriaCms } from '../models/categoria.model';

interface StrapiListResponse<T> {
  data: T[];
}

@Injectable({ providedIn: 'root' })
export class CategoriaApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/categorias`;

  list(): Observable<CategoriaCms[]> {
    return this.http
      .get<StrapiListResponse<CategoriaCms>>(this.baseUrl, {
        params: { sort: 'orden:asc' },
      })
      .pipe(map((res) => res.data));
  }
}
