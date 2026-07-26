export interface ComunidadUser {
  id: number;
  username: string;
}

export interface Publicacion {
  id: number;
  documentId: string;
  titulo: string;
  contenido: string;
  createdAt: string;
  owner?: ComunidadUser | null;
  comentarios?: { id: number }[];
}

export interface PublicacionInput {
  titulo: string;
  contenido: string;
}

export interface Comentario {
  id: number;
  documentId: string;
  contenido: string;
  createdAt: string;
  owner?: ComunidadUser | null;
  parent?: { documentId: string } | null;
}

export interface ComentarioInput {
  contenido: string;
  publicacion: string;
  parent?: string;
}

/** Client-built tree node — Strapi returns a flat list, threading happens in the browser. */
export interface ComentarioNode {
  comentario: Comentario;
  children: ComentarioNode[];
}
