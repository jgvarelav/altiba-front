import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../components/navbar/navbar';
import { ScrollTopButton } from '../../shared/components/scroll-top-button/scroll-top-button';

@Component({
  selector: 'app-main-layout',
  imports: [Navbar, RouterOutlet, ScrollTopButton],
  template: `
    <app-navbar />
    <main class="min-h-screen bg-gray-50 pt-16 lg:pt-20">
      <router-outlet />
    </main>
    <app-scroll-top-button />
  `,
})
export class MainLayout {}
