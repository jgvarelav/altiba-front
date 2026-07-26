import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Evento } from '../models/evento.model';

interface StrapiListResponse<T> {
  data: T[];
}

@Injectable({ providedIn: 'root' })
export class EventoApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/eventos`;

  list(): Observable<Evento[]> {
    return this.http
      .get<StrapiListResponse<Evento>>(this.baseUrl, {
        params: { populate: 'imagen', sort: 'fecha:asc' },
      })
      .pipe(map((res) => res.data));
  }

  listProximos(limit = 3): Observable<Evento[]> {
    return this.http
      .get<StrapiListResponse<Evento>>(this.baseUrl, {
        params: {
          populate: 'imagen',
          sort: 'fecha:asc',
          'filters[fecha][$gte]': new Date().toISOString(),
          'pagination[limit]': limit,
        },
      })
      .pipe(map((res) => res.data));
  }
}
