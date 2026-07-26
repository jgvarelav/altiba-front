import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faXmark,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import {
  faInstagram,
  faFacebookF,
  faYoutube,
  faTiktok,
} from '@fortawesome/free-brands-svg-icons';
import { NAV_ITEMS } from '../../nav-items';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [DrawerModule, FaIconComponent, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly visible = signal(false);

  readonly navItems = NAV_ITEMS;
  readonly currentUser = this.authService.currentUser;

  readonly faUser = faUser;
  readonly faXmark = faXmark;
  readonly faRightFromBracket = faRightFromBracket;
  readonly faInstagram = faInstagram;
  readonly faFacebookF = faFacebookF;
  readonly faYoutube = faYoutube;
  readonly faTiktok = faTiktok;

  open(): void {
    this.visible.set(true);
  }

  close(): void {
    this.visible.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.close();
    this.router.navigateByUrl('/');
  }
}
