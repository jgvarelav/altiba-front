const MESES_ABREV = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const DIAS_SEMANA = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];
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

export function eventoDiaMes(fecha: string): { day: string; month: string } {
  const date = new Date(fecha);
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: MESES_ABREV[date.getMonth()],
  };
}

export function eventoHora(fecha: string): string {
  const date = new Date(fecha);
  return date.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
}

export function eventoFechaLarga(fecha: string): string {
  const date = new Date(fecha);
  const diaSemana = DIAS_SEMANA[date.getDay()];
  const mes = MESES[date.getMonth()];
  return `${diaSemana}, ${date.getDate()} de ${mes} de ${date.getFullYear()} · ${eventoHora(fecha)}`;
}
