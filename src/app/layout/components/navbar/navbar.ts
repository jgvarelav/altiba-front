import { Component, HostListener, ViewChild, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faMagnifyingGlass,
  faBell,
  faEnvelope,
  faChevronDown,
  faUser,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { Sidebar } from '../sidebar/sidebar';
import { ClickOutsideDirective } from '../../../shared/utils/click-outside.directive';
import { NAV_ITEMS } from '../../nav-items';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, FaIconComponent, Sidebar, ClickOutsideDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @ViewChild(Sidebar) private sidebar!: Sidebar;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly navItems = NAV_ITEMS;
  readonly currentUser = this.authService.currentUser;

  readonly isProfileMenuOpen = signal(false);
  readonly scrolled = signal(false);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  readonly faBars = faBars;
  readonly faMagnifyingGlass = faMagnifyingGlass;
  readonly faBell = faBell;
  readonly faEnvelope = faEnvelope;
  readonly faChevronDown = faChevronDown;
  readonly faUser = faUser;
  readonly faRightFromBracket = faRightFromBracket;

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
}
