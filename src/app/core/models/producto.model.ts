export type Categoria =
  | 'agro_alimentos'
  | 'artesanias'
  | 'turismo_rural'
  | 'tecnologia_innovacion'
  | 'servicios';

export interface StrapiMedia {
  id: number;
  url: string;
}

/** Strapi's rich text "blocks" format — minimal shape covering plain paragraphs. */
export interface BlocksNode {
  type: string;
  children: { type: string; text?: string }[];
}

export type BlocksContent = BlocksNode[];

export interface Producto {
  id: number;
  documentId: string;
  nombre: string;
  descripcion: BlocksContent | null;
  precio: number;
  categoria: Categoria;
  ubicacion: string | null;
  numero_contacto: string | null;
  /** Admin-only — set from the Strapi admin panel, never from this app. */
  destacado: boolean;
  imagenes?: StrapiMedia[];
  owner?: { id: number; username: string } | null;
}

export interface ProductoInput {
  nombre: string;
  descripcion?: BlocksContent;
  precio: number;
  categoria: Categoria;
  ubicacion?: string;
  numero_contacto?: string;
  imagenes?: number[];
}
