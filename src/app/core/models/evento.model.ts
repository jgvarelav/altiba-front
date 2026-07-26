import { StrapiMedia } from './producto.model';

export interface Evento {
  id: number;
  documentId: string;
  titulo: string;
  descripcion: string;
  /** ISO datetime string. */
  fecha: string;
  ubicacion: string | null;
  imagen?: StrapiMedia | null;
}
