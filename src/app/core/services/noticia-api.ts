import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Noticia } from '../models/noticia.model';

interface StrapiListResponse<T> {
  data: T[];
}

interface StrapiItemResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class NoticiaApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/noticias`;

  list(): Observable<Noticia[]> {
    return this.http
      .get<StrapiListResponse<Noticia>>(this.baseUrl, {
        params: { populate: 'imagen', sort: 'fecha:desc' },
      })
      .pipe(map((res) => res.data));
  }

  getByDocumentId(documentId: string): Observable<Noticia> {
    return this.http
      .get<StrapiItemResponse<Noticia>>(`${this.baseUrl}/${documentId}`, {
        params: { populate: 'imagen' },
      })
      .pipe(map((res) => res.data));
  }
}
