import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Producto, ProductoInput } from '../../../core/models/producto.model';

interface StrapiListResponse<T> {
  data: T[];
}

interface StrapiItemResponse<T> {
  data: T;
}

interface StrapiUploadFile {
  id: number;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class ProductoApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/productos`;

  list(categoria?: string): Observable<Producto[]> {
    const params: Record<string, string> = { populate: '*' };
    if (categoria) {
      params['filters[categoria][$eq]'] = categoria;
    }

    return this.http
      .get<StrapiListResponse<Producto>>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  listDestacados(limit = 4): Observable<Producto[]> {
    return this.http
      .get<StrapiListResponse<Producto>>(this.baseUrl, {
        params: {
          populate: '*',
          'filters[destacado][$eq]': 'true',
          'pagination[limit]': limit,
        },
      })
      .pipe(map((res) => res.data));
  }

  getByDocumentId(documentId: string): Observable<Producto> {
    return this.http
      .get<StrapiItemResponse<Producto>>(`${this.baseUrl}/${documentId}`, {
        params: { populate: '*' },
      })
      .pipe(map((res) => res.data));
  }

  create(input: Partial<ProductoInput>): Observable<Producto> {
    return this.http
      .post<StrapiItemResponse<Producto>>(this.baseUrl, { data: input })
      .pipe(map((res) => res.data));
  }

  update(documentId: string, input: Partial<ProductoInput>): Observable<Producto> {
    return this.http
      .put<StrapiItemResponse<Producto>>(`${this.baseUrl}/${documentId}`, { data: input })
      .pipe(map((res) => res.data));
  }

  remove(documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${documentId}`);
  }

  uploadImages(files: File[]): Observable<number[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return this.http
      .post<StrapiUploadFile[]>(`${environment.apiUrl}/api/upload`, formData)
      .pipe(map((uploaded) => uploaded.map((f) => f.id)));
  }
}
