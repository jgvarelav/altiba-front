import { Component, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faBars,
  faMagnifyingGlass,
  faHeadset,
  faEnvelope,
  faChevronDown,
  faUser,
  faRightFromBracket,
  faArrowRight,
  faBriefcase,
  faCalendarDays,
  faNewspaper,
  faComments,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Sidebar } from '../sidebar/sidebar';
import { ClickOutsideDirective } from '../../../shared/utils/click-outside.directive';
import { NAV_ITEMS } from '../../nav-items';
import { AuthService } from '../../../core/services/auth';
import { SearchResults, SearchService } from '../../../core/services/search';
import { Evento } from '../../../core/models/evento.model';
import { CATEGORIAS } from '../../../core/models/categorias.const';
import { SOPORTE, soporteMailHref, soporteWhatsappHref } from '../../../core/models/soporte.const';
import { openEventoDetail } from '../../../features/eventos/utils/evento-popup';
import { environment } from '../../../../environments/environment';

interface SearchHit {
  key: string;
  title: string;
  subtitle: string;
  icon: IconDefinition;
  route?: unknown[];
  evento?: Evento;
}

/** Suggestions shown per collection in the navbar dropdown. */
const HITS_PER_TYPE = 3;

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, FaIconComponent, Sidebar, ClickOutsideDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @ViewChild(Sidebar) private sidebar!: Sidebar;

  private readonly authService = inject(AuthService);
  private readonly searchService = inject(SearchService);
  private readonly router = inject(Router);

  readonly navItems = NAV_ITEMS;
  readonly currentUser = this.authService.currentUser;

  readonly isProfileMenuOpen = signal(false);
  readonly scrolled = signal(false);

  readonly searchQuery = signal('');
  readonly searchOpen = signal(false);
  /** Loaded on first focus of the search box, so pages that never search don't pay for it. */
  private readonly searchIndex = signal<SearchResults | null>(null);
  readonly searchIndexLoading = signal(false);

  readonly searchHits = computed<SearchHit[]>(() => {
    const index = this.searchIndex();
    if (!index) return [];
    const r = this.searchService.filter(index, this.searchQuery());
    return [
      ...r.productos.slice(0, HITS_PER_TYPE).map((p) => ({
        key: 'p' + p.documentId,
        title: p.nombre,
        subtitle: `Emprendimiento · ${CATEGORIAS.find((c) => c.value === p.categoria)?.label ?? ''}`,
        icon: faBriefcase,
        route: ['/', 'emprendimientos', p.documentId],
      })),
      ...r.eventos.slice(0, HITS_PER_TYPE).map((e) => ({
        key: 'e' + e.documentId,
        title: e.titulo,
        subtitle: 'Evento' + (e.ubicacion ? ` · ${e.ubicacion}` : ''),
        icon: faCalendarDays,
        evento: e,
      })),
      ...r.noticias.slice(0, HITS_PER_TYPE).map((n) => ({
        key: 'n' + n.documentId,
        title: n.titulo,
        subtitle: 'Noticia',
        icon: faNewspaper,
        route: ['/', 'noticias', n.documentId],
      })),
      ...r.publicaciones.slice(0, HITS_PER_TYPE).map((p) => ({
        key: 'c' + p.documentId,
        title: p.titulo,
        subtitle: `Comunidad · ${p.owner?.username ?? 'Usuario'}`,
        icon: faComments,
        route: ['/', 'comunidad', p.documentId],
      })),
    ];
  });

  readonly supportOpen = signal(false);
  readonly soporte = SOPORTE;
  readonly supportMailHref = soporteMailHref('Soporte Altiba Conecta Lab');
  readonly supportWhatsappHref = computed(() => {
    const user = this.currentUser()?.username;
    return soporteWhatsappHref(
      `Hola, necesito soporte con Altiba Conecta Lab${user ? ` (usuario: ${user})` : ''}.`,
    );
  });

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  readonly faBars = faBars;
  readonly faMagnifyingGlass = faMagnifyingGlass;
  readonly faHeadset = faHeadset;
  readonly faEnvelope = faEnvelope;
  readonly faWhatsapp = faWhatsapp;
  readonly faChevronDown = faChevronDown;
  readonly faUser = faUser;
  readonly faRightFromBracket = faRightFromBracket;
  readonly faArrowRight = faArrowRight;

  openSidebar(): void {
    this.sidebar.open();
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen.update((v) => !v);
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.closeProfileMenu();
    this.router.navigateByUrl('/');
  }

  onSearchFocus(): void {
    this.searchOpen.set(true);
    if (!this.searchIndex() && !this.searchIndexLoading()) {
      this.searchIndexLoading.set(true);
      this.searchService.loadIndex().subscribe((index) => {
        this.searchIndex.set(index);
        this.searchIndexLoading.set(false);
      });
    }
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
    this.searchOpen.set(true);
  }

  submitSearch(event: Event): void {
    event.preventDefault();
    this.goToSearchPage();
  }

  goToSearchPage(): void {
    const q = this.searchQuery().trim();
    this.searchOpen.set(false);
    this.router.navigate(['/', 'buscar'], { queryParams: q ? { q } : {} });
  }

  openHit(hit: SearchHit): void {
    this.searchOpen.set(false);
    if (hit.evento) {
      openEventoDetail(hit.evento, environment.apiUrl);
    } else if (hit.route) {
      this.router.navigate(hit.route);
    }
  }
}
