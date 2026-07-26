import { Evento } from '../../../core/models/evento.model';
import { eventoFechaLarga } from './evento-format';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Dynamically imported so Home (eagerly loaded) doesn't pull sweetalert2 into the initial bundle. */
export async function openEventoDetail(evento: Evento, apiUrl: string): Promise<void> {
  const { default: Swal } = await import('sweetalert2');
  const imageUrl = evento.imagen ? apiUrl + evento.imagen.url : null;

  Swal.fire({
    title: escapeHtml(evento.titulo),
    html: `
      <div style="text-align:left">
        ${
          imageUrl
            ? `<div style="position:relative;margin-bottom:16px;height:200px;width:100%;overflow:hidden;border-radius:0.5rem;background:#f3f4f6">
                <img src="${imageUrl}" style="position:absolute;inset:0;height:100%;width:100%;object-fit:cover" />
              </div>`
            : ''
        }
        <p style="margin:4px 0"><strong>Fecha:</strong> ${escapeHtml(eventoFechaLarga(evento.fecha))}</p>
        ${evento.ubicacion ? `<p style="margin:4px 0"><strong>Lugar:</strong> ${escapeHtml(evento.ubicacion)}</p>` : ''}
        <p style="margin-top:12px;white-space:pre-line">${escapeHtml(evento.descripcion)}</p>
      </div>
    `,
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#6fa834',
    width: 560,
  });
}
