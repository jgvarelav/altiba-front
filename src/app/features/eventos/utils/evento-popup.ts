import { Evento } from '../../../core/models/evento.model';
import { contactoHref } from '../../../shared/utils/contacto-href';
import { eventoFechaLarga, eventoFechaDia } from './evento-format';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function eventoHtml(evento: Evento, apiUrl: string, showTitle: boolean): string {
  const imageUrl = evento.imagen ? apiUrl + evento.imagen.url : null;
  const href = evento.contacto ? contactoHref(evento.contacto) : null;

  return `
    <div style="text-align:left">
      ${
        showTitle
          ? `<h3 style="margin:0 0 8px;font-size:1.1rem;font-weight:700;color:#0f2418">${escapeHtml(evento.titulo)}</h3>`
          : ''
      }
      ${
        imageUrl
          ? `<div style="position:relative;margin-bottom:16px;height:200px;width:100%;overflow:hidden;border-radius:0.5rem;background:#f3f4f6">
              <img src="${escapeHtml(imageUrl)}" style="position:absolute;inset:0;height:100%;width:100%;object-fit:cover" />
            </div>`
          : ''
      }
      <p style="margin:4px 0"><strong>Fecha:</strong> ${escapeHtml(eventoFechaLarga(evento.fecha))}</p>
      ${evento.ubicacion ? `<p style="margin:4px 0"><strong>Lugar:</strong> ${escapeHtml(evento.ubicacion)}</p>` : ''}
      <p style="margin-top:12px;white-space:pre-line">${escapeHtml(evento.descripcion)}</p>
      ${
        evento.contacto
          ? `<div style="margin-top:16px;border-radius:0.5rem;background:#f1f7ea;padding:12px 14px">
              <p style="margin:0;font-size:0.85rem;font-weight:600;color:#4f7d24">¿Quieres participar?</p>
              ${
                href
                  ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener" style="display:inline-block;margin-top:4px;color:#0f2418;font-weight:600;text-decoration:underline">${escapeHtml(evento.contacto)}</a>`
                  : `<p style="margin:4px 0 0;color:#0f2418;font-weight:600">${escapeHtml(evento.contacto)}</p>`
              }
            </div>`
          : ''
      }
    </div>
  `;
}

/** Dynamically imported so Home (eagerly loaded) doesn't pull sweetalert2 into the initial bundle. */
export async function openEventoDetail(evento: Evento, apiUrl: string): Promise<void> {
  const { default: Swal } = await import('sweetalert2');

  Swal.fire({
    title: escapeHtml(evento.titulo),
    html: eventoHtml(evento, apiUrl, false),
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#6fa834',
    width: 560,
  });
}

/** Detail popup for a calendar day — a single event reuses the normal popup. */
export async function openEventosDelDia(eventos: Evento[], apiUrl: string): Promise<void> {
  if (eventos.length === 0) return;
  if (eventos.length === 1) return openEventoDetail(eventos[0], apiUrl);

  const { default: Swal } = await import('sweetalert2');
  const separator = '<hr style="margin:20px 0;border:none;border-top:1px solid #e5e7eb" />';

  Swal.fire({
    title: `Eventos del ${escapeHtml(eventoFechaDia(eventos[0].fecha))}`,
    html: eventos.map((evento) => eventoHtml(evento, apiUrl, true)).join(separator),
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#6fa834',
    width: 560,
  });
}
