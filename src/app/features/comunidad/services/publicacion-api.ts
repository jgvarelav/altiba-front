import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Publicacion, PublicacionInput } from '../../../core/models/comunidad.model';

interface StrapiListResponse<T> {
  data: T[];
}

interface StrapiItemResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class PublicacionApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/publicaciones`;

  list(): Observable<Publicacion[]> {
    return this.http
      .get<StrapiListResponse<Publicacion>>(this.baseUrl, {
        params: {
          'populate[owner][fields][0]': 'username',
          'populate[comentarios][fields][0]': 'id',
          sort: 'createdAt:desc',
        },
      })
      .pipe(map((res) => res.data));
  }

  getByDocumentId(documentId: string): Observable<Publicacion> {
    return this.http
      .get<StrapiItemResponse<Publicacion>>(`${this.baseUrl}/${documentId}`, {
        params: { 'populate[owner][fields][0]': 'username' },
      })
      .pipe(map((res) => res.data));
  }

  create(input: PublicacionInput): Observable<Publicacion> {
    return this.http
      .post<StrapiItemResponse<Publicacion>>(this.baseUrl, { data: input })
      .pipe(map((res) => res.data));
  }

  remove(documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${documentId}`);
  }
}
