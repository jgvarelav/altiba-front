import { StrapiMedia } from './producto.model';

export interface Noticia {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  /** ISO date string (no time component). */
  fecha: string;
  imagen?: StrapiMedia | null;
}
