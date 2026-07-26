import { Component, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCalendarDays, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { EventoApi } from '../../../../core/services/evento-api';
import { Evento } from '../../../../core/models/evento.model';
import { environment } from '../../../../../environments/environment';
import { eventoDiaMes, eventoHora } from '../../utils/evento-format';
import { openEventoDetail } from '../../utils/evento-popup';
import { ScrollRevealDirective } from '../../../../shared/utils/scroll-reveal.directive';

@Component({
  selector: 'app-eventos-list',
  imports: [FaIconComponent, ScrollRevealDirective],
  templateUrl: './eventos-list.html',
})
export class EventosList {
  private readonly eventoApi = inject(EventoApi);

  readonly apiUrl = environment.apiUrl;
  readonly eventos = signal<Evento[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly faCalendarDays = faCalendarDays;
  readonly faLocationDot = faLocationDot;

  constructor() {
    this.eventoApi.list().subscribe({
      next: (eventos) => {
        this.eventos.set(eventos);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No pudimos cargar los eventos.');
        this.loading.set(false);
      },
    });
  }

  diaMes(fecha: string) {
    return eventoDiaMes(fecha);
  }

  hora(fecha: string): string {
    return eventoHora(fecha);
  }

  imagenUrl(evento: Evento): string | null {
    return evento.imagen ? this.apiUrl + evento.imagen.url : null;
  }

  openDetail(evento: Evento): void {
    openEventoDetail(evento, this.apiUrl);
  }
}
