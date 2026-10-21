import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { DatePickerMonthChangeEvent } from 'primeng/types/datepicker';
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
import { diaKey, eventoDiaKey, eventoDiaMes, eventoHora, mesAnio } from '../../utils/evento-format';
import { openEventoDetail, openEventosDelDia } from '../../utils/evento-popup';
import { ScrollRevealDirective } from '../../../../shared/utils/scroll-reveal.directive';

@Component({
  selector: 'app-eventos-list',
  imports: [FormsModule, DatePickerModule, FaIconComponent, ScrollRevealDirective],
  templateUrl: './eventos-list.html',
  styleUrl: './eventos-list.css',
})
export class EventosList {
  private readonly eventoApi = inject(EventoApi);

  readonly apiUrl = environment.apiUrl;
  readonly eventos = signal<Evento[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  /** Month currently displayed by the calendar (0-based month). */
  readonly visibleMonth = signal(this.monthOf(new Date()));
  selectedDate: Date | null = null;

  readonly faCalendarDays = faCalendarDays;
  readonly faClock = faClock;
  readonly faHandshake = faHandshake;
  readonly faLocationDot = faLocationDot;

  readonly eventosPorDia = computed(() => {
    const map = new Map<string, Evento[]>();
    for (const evento of this.eventos()) {
      const key = eventoDiaKey(evento.fecha);
      map.set(key, [...(map.get(key) ?? []), evento]);
    }
    return map;
  });

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

  tieneEventos(year: number, month: number, day: number): boolean {
    return this.eventosPorDia().has(diaKey(year, month, day));
  }

  onMonthChange(event: DatePickerMonthChangeEvent): void {
    // PrimeNG reports a 1-based month here, unlike the 0-based date template metadata.
    if (event.month !== undefined && event.year !== undefined) {
      this.visibleMonth.set({ month: event.month - 1, year: event.year });
    }
  }

  onSelectDate(date: Date): void {
    const eventos = this.eventosPorDia().get(
      diaKey(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    if (eventos) {
      openEventosDelDia(eventos, this.apiUrl);
    }
  }

  irAEvento(evento: Evento): void {
    const date = new Date(evento.fecha);
    this.selectedDate = date;
    this.visibleMonth.set(this.monthOf(date));
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

  private monthOf(date: Date): { month: number; year: number } {
    return { month: date.getMonth(), year: date.getFullYear() };
  }
}
