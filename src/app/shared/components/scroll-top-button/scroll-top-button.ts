import { Component, HostListener, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-scroll-top-button',
  imports: [FaIconComponent],
  templateUrl: './scroll-top-button.html',
})
export class ScrollTopButton {
  readonly visible = signal(false);
  readonly faArrowUp = faArrowUp;

  @HostListener('window:scroll')
  onScroll(): void {
    this.visible.set(window.scrollY > 480);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
