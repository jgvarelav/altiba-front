import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Comentario, ComentarioInput } from '../../../core/models/comunidad.model';

interface StrapiListResponse<T> {
  data: T[];
}

interface StrapiItemResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ComentarioApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/comentarios`;

  listByPublicacion(publicacionDocumentId: string): Observable<Comentario[]> {
    return this.http
      .get<StrapiListResponse<Comentario>>(this.baseUrl, {
        params: {
          'filters[publicacion][documentId][$eq]': publicacionDocumentId,
          'populate[owner][fields][0]': 'username',
          'populate[parent][fields][0]': 'documentId',
          sort: 'createdAt:asc',
          'pagination[pageSize]': 200,
        },
      })
      .pipe(map((res) => res.data));
  }

  create(input: ComentarioInput): Observable<Comentario> {
    return this.http
      .post<StrapiItemResponse<Comentario>>(this.baseUrl, { data: input })
      .pipe(map((res) => res.data));
  }

  remove(documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${documentId}`);
  }
}
