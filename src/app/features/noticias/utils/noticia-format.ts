const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/** { day: '20', month: 'OCT' } — for the date badge on news cards. */
export function noticiaDiaMes(fecha: string): { day: string; month: string } {
  const date = new Date(fecha + 'T00:00:00');
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: MESES[date.getMonth()].slice(0, 3).toUpperCase(),
  };
}

export function noticiaFechaLarga(fecha: string): string {
  const date = new Date(fecha + 'T00:00:00');
  return `${date.getDate()} de ${MESES[date.getMonth()]} de ${date.getFullYear()}`;
}
