import { Component, computed, input, model, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Evento } from '../../../../core/models/evento.model';
import { diaKey, eventoDiaKey, eventoHora, mesAnio } from '../../utils/evento-format';

export interface MesVisible {
  /** 0-based month. */
  month: number;
  year: number;
}

interface BoardCell {
  key: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
  eventos: Evento[];
}

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

/** Sticky-note colors; each event always gets the same one (hashed from its documentId). */
const NOTE_COLORS = ['#fde68a', '#fdba74', '#f9a8d4', '#bef264', '#5eead4', '#7dd3fc', '#c4b5fd'];

/** Notes shown per day before collapsing the rest into a "+N más" chip. */
const MAX_NOTES = 2;

/**
 * Month "whiteboard": a full calendar grid where each event is a sticky note inside its day.
 * Weeks start on Sunday. On mobile the notes collapse to colored dots.
 */
@Component({
  selector: 'app-eventos-board',
  imports: [FaIconComponent],
  templateUrl: './eventos-board.html',
  styleUrl: './eventos-board.css',
})
export class EventosBoard {
  readonly eventos = input.required<Evento[]>();
  readonly mes = model.required<MesVisible>();
  readonly eventoSelect = output<Evento>();
  readonly diaSelect = output<Evento[]>();

  readonly dias = DIAS;
  readonly maxNotes = MAX_NOTES;
  readonly faChevronLeft = faChevronLeft;
  readonly faChevronRight = faChevronRight;

  readonly titulo = computed(() => mesAnio(this.mes().month, this.mes().year));
  /** Changes with the month, so the grid re-renders and the notes replay their pop-in. */
  readonly mesKey = computed(() => `${this.mes().year}-${this.mes().month}`);

  private readonly eventosPorDia = computed(() => {
    const map = new Map<string, Evento[]>();
    const sorted = [...this.eventos()].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
    );
    for (const evento of sorted) {
      const key = eventoDiaKey(evento.fecha);
      map.set(key, [...(map.get(key) ?? []), evento]);
    }
    return map;
  });

  readonly semanas = computed<BoardCell[][]>(() => {
    const { month, year } = this.mes();
    const today = new Date();
    const todayKey = diaKey(today.getFullYear(), today.getMonth(), today.getDate());
    const offset = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;

    const cells: BoardCell[] = [];
    for (let i = 0; i < totalCells; i++) {
      // Day 0 / negative / past the end roll over into the adjacent months.
      const date = new Date(year, month, i - offset + 1);
      const key = diaKey(date.getFullYear(), date.getMonth(), date.getDate());
      cells.push({
        key,
        day: date.getDate(),
        inMonth: date.getMonth() === month,
        isToday: key === todayKey,
        eventos: this.eventosPorDia().get(key) ?? [],
      });
    }

    const weeks: BoardCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
  });

  prevMonth(): void {
    this.shiftMonth(-1);
  }

  nextMonth(): void {
    this.shiftMonth(1);
  }

  goToday(): void {
    const today = new Date();
    this.mes.set({ month: today.getMonth(), year: today.getFullYear() });
  }

  openDia(cell: BoardCell): void {
    if (cell.eventos.length > 0) {
      this.diaSelect.emit(cell.eventos);
    }
  }

  openEvento(evento: Evento, event: Event): void {
    event.stopPropagation();
    this.eventoSelect.emit(evento);
  }

  hora(fecha: string): string {
    return eventoHora(fecha);
  }

  noteColor(evento: Evento): string {
    return NOTE_COLORS[this.hash(evento.documentId) % NOTE_COLORS.length];
  }

  /** A slight, stable tilt between -3deg and 3deg so the notes look hand-placed. */
  noteTilt(evento: Evento): string {
    return `${(this.hash(evento.documentId) % 7) - 3}deg`;
  }

  private shiftMonth(delta: number): void {
    const { month, year } = this.mes();
    const date = new Date(year, month + delta, 1);
    this.mes.set({ month: date.getMonth(), year: date.getFullYear() });
  }

  private hash(value: string): number {
    let h = 0;
    for (const char of value) {
      h = (h * 31 + char.charCodeAt(0)) >>> 0;
    }
    return h;
  }
}
