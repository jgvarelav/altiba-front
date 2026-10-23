import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../components/navbar/navbar';
import { ScrollTopButton } from '../../shared/components/scroll-top-button/scroll-top-button';
import { EnVivoPopup } from '../../shared/components/en-vivo-popup/en-vivo-popup';

@Component({
  selector: 'app-main-layout',
  imports: [Navbar, RouterOutlet, ScrollTopButton, EnVivoPopup],
  template: `
    <app-navbar />
    <main class="min-h-screen pt-16 lg:pt-20">
      <router-outlet />
    </main>
    <app-scroll-top-button />
    <app-en-vivo-popup />
  `,
})
export class MainLayout {}
