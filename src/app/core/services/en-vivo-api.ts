import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EnVivo } from '../models/en-vivo.model';

@Injectable({ providedIn: 'root' })
export class EnVivoApi {
  private readonly http = inject(HttpClient);

  /**
   * The live-stream announcement, or null when it's switched off. Strapi answers 404 until
   * the admin saves the single type for the first time — treated the same as "off".
   */
  getActivo(): Observable<EnVivo | null> {
    return this.http.get<{ data: EnVivo | null }>(`${environment.apiUrl}/api/en-vivo`).pipe(
      map((res) => (res.data?.activo && res.data.url ? res.data : null)),
      catchError(() => of(null)),
    );
  }
}
