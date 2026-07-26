import { Categoria as CategoriaSlug } from './producto.model';

export interface CategoriaCms {
  id: number;
  documentId: string;
  nombre: string;
  slug: CategoriaSlug;
  color: string;
  icono: string;
  orden: number;
}
