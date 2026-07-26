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

export function noticiaFechaLarga(fecha: string): string {
  const date = new Date(fecha + 'T00:00:00');
  return `${date.getDate()} de ${MESES[date.getMonth()]} de ${date.getFullYear()}`;
}
