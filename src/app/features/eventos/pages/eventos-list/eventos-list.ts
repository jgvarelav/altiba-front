import { Component, computed, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faCalendarDays,
  faClock,
  faHandshake,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { EventoApi } from '../../../../core/services/evento-api';
import { Evento } from '../../../../core/models/evento.model';
import { environment } from '../../../../../environments/environment';
import { eventoDiaMes, eventoHora, mesAnio } from '../../utils/evento-format';
import { openEventoDetail, openEventosDelDia } from '../../utils/evento-popup';
import { ScrollRevealDirective } from '../../../../shared/utils/scroll-reveal.directive';
import { EventosBoard, MesVisible } from '../../components/eventos-board/eventos-board';

@Component({
  selector: 'app-eventos-list',
  imports: [FaIconComponent, ScrollRevealDirective, EventosBoard],
  templateUrl: './eventos-list.html',
})
export class EventosList {
  private readonly eventoApi = inject(EventoApi);

  readonly apiUrl = environment.apiUrl;
  readonly eventos = signal<Evento[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  /** Month currently displayed by the board (0-based month). */
  readonly visibleMonth = signal<MesVisible>(this.monthOf(new Date()));

  readonly faCalendarDays = faCalendarDays;
  readonly faClock = faClock;
  readonly faHandshake = faHandshake;
  readonly faLocationDot = faLocationDot;

  readonly eventosDelMes = computed(() => {
    const { month, year } = this.visibleMonth();
    return this.eventos().filter((evento) => {
      const date = new Date(evento.fecha);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  });

  readonly tituloMes = computed(() => {
    const { month, year } = this.visibleMonth();
    return mesAnio(month, year);
  });

  /** First event after the visible month — offered as a shortcut when the month is empty. */
  readonly proximoEvento = computed(() => {
    const { month, year } = this.visibleMonth();
    const inicioSiguienteMes = new Date(year, month + 1, 1).getTime();
    return this.eventos().find((e) => new Date(e.fecha).getTime() >= inicioSiguienteMes) ?? null;
  });

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

  openDia(eventos: Evento[]): void {
    openEventosDelDia(eventos, this.apiUrl);
  }

  irAEvento(evento: Evento): void {
    this.visibleMonth.set(this.monthOf(new Date(evento.fecha)));
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

  private monthOf(date: Date): MesVisible {
    return { month: date.getMonth(), year: date.getFullYear() };
  }
}
