/** Strapi "En vivo" single type — toggled by the admin to announce a live stream. */
export interface EnVivo {
  activo: boolean;
  titulo: string;
  descripcion: string | null;
  url: string;
  textoBoton: string | null;
  updatedAt: string;
}
