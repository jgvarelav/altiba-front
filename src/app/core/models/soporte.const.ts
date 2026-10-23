/** Admin contact used by the Contacto page and the navbar's "Soporte" menu. */
export const SOPORTE = {
  email: 'contacto@altibaconectalab.com',
  telefono: '301 699 1037',
  /** International format without "+" or spaces, as wa.me and tel: links expect. */
  telefonoIntl: '573016991037',
};

export function soporteWhatsappHref(mensaje: string): string {
  return `https://wa.me/${SOPORTE.telefonoIntl}?text=${encodeURIComponent(mensaje)}`;
}

export function soporteMailHref(asunto: string): string {
  return `mailto:${SOPORTE.email}?subject=${encodeURIComponent(asunto)}`;
}
