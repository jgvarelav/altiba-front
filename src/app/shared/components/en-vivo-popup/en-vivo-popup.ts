import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faXmark,
  faTowerBroadcast,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { EnVivoApi } from '../../../core/services/en-vivo-api';
import { EnVivo } from '../../../core/models/en-vivo.model';

const SEEN_KEY = 'altiba-en-vivo-visto';

/** Extracts the video id from watch?v=, youtu.be/, /live/, /embed/ and /shorts/ links. */
function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|live\/|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? match[1] : null;
}

/**
 * "¡Estamos en vivo!" popup, shown on page load while the admin has the Strapi "En vivo"
 * single type switched on. It opens once per browser session per broadcast (keyed by the
 * entry's updatedAt, so a new broadcast shows again); after closing it, a small pulsing
 * "En vivo" pill stays in the corner to reopen it.
 */
@Component({
  selector: 'app-en-vivo-popup',
  imports: [FaIconComponent],
  templateUrl: './en-vivo-popup.html',
  styleUrl: './en-vivo-popup.css',
})
export class EnVivoPopup {
  private readonly sanitizer = inject(DomSanitizer);

  readonly enVivo = signal<EnVivo | null>(null);
  readonly open = signal(false);

  /** Embedded player for YouTube links; other platforms just get the button. */
  readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const id = this.enVivo() ? youtubeId(this.enVivo()!.url) : null;
    // Safe to trust: the URL is built here from a validated 11-char video id.
    return id
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1`,
        )
      : null;
  });

  readonly faXmark = faXmark;
  readonly faTowerBroadcast = faTowerBroadcast;
  readonly faArrowUpRightFromSquare = faArrowUpRightFromSquare;

  constructor() {
    inject(EnVivoApi)
      .getActivo()
      .subscribe((enVivo) => {
        this.enVivo.set(enVivo);
        if (enVivo && this.readSeen() !== enVivo.updatedAt) {
          this.open.set(true);
        }
      });
  }

  @HostListener('document:keydown.escape')
  close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.writeSeen(this.enVivo()?.updatedAt ?? '');
  }

  reopen(): void {
    this.open.set(true);
  }

  private readSeen(): string | null {
    try {
      return sessionStorage.getItem(SEEN_KEY);
    } catch {
      return null;
    }
  }

  private writeSeen(value: string): void {
    try {
      sessionStorage.setItem(SEEN_KEY, value);
    } catch {
      // Storage unavailable (private mode etc.): the popup will just show again next load.
    }
  }
}
