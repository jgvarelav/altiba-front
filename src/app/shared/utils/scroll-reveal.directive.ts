import { Directive, ElementRef, OnDestroy, OnInit, inject, input, signal } from '@angular/core';

/**
 * Fades + slides an element into place the first time it enters the viewport.
 * One-shot (the observer disconnects after revealing) so it never re-triggers
 * on scroll-back-up, and is skipped entirely for prefers-reduced-motion.
 */
@Directive({
  selector: '[appScrollReveal]',
  host: {
    class: 'transition-all duration-700 ease-out will-change-transform',
    '[class.opacity-0]': '!visible()',
    '[class.translate-y-6]': '!visible()',
    '[class.opacity-100]': 'visible()',
    '[class.translate-y-0]': 'visible()',
    '[style.transition-delay.ms]': 'appScrollReveal()',
  },
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  /** Optional stagger delay in ms — pass `$index * 80` inside an @for loop. */
  readonly appScrollReveal = input(0);

  readonly visible = signal(false);

  ngOnInit(): void {
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      this.visible.set(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.visible.set(true);
          this.observer?.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    );
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
