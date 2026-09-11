import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Evento } from '../models/evento.model';

interface StrapiListResponse<T> {
  data: T[];
}

@Injectable({ providedIn: 'root' })
export class EventoApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/eventos`;

  // Cached for the lifetime of the app — eventos are admin-managed, not
  // user-generated, so the full list is small and safe to keep in memory
  // instead of refetching on every navigation. Cleared on a full page reload.
  private cache$?: Observable<Evento[]>;

  list(): Observable<Evento[]> {
    this.cache$ ??= this.http
      .get<StrapiListResponse<Evento>>(this.baseUrl, {
        params: { populate: 'imagen', sort: 'fecha:asc' },
      })
      .pipe(
        map((res) => res.data),
        shareReplay(1),
      );
    return this.cache$;
  }

  listProximos(limit = 3): Observable<Evento[]> {
    const now = Date.now();
    return this.list().pipe(
      map((eventos) => eventos.filter((e) => new Date(e.fecha).getTime() >= now).slice(0, limit)),
    );
  }
}
