import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: HomeComponent },
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
      {
        path: 'emprendimientos',
        loadChildren: () =>
          import('./features/emprendimientos/emprendimientos.routes').then(
            (m) => m.EMPRENDIMIENTOS_ROUTES,
          ),
      },
      {
        path: 'eventos',
        loadChildren: () =>
          import('./features/eventos/eventos.routes').then((m) => m.EVENTOS_ROUTES),
      },
      {
        path: 'noticias',
        loadChildren: () =>
          import('./features/noticias/noticias.routes').then((m) => m.NOTICIAS_ROUTES),
      },
      {
        path: 'comunidad',
        loadChildren: () =>
          import('./features/comunidad/comunidad.routes').then((m) => m.COMUNIDAD_ROUTES),
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('./features/perfil/perfil.routes').then((m) => m.PERFIL_ROUTES),
      },
      {
        path: 'sobre-nosotros',
        loadChildren: () =>
          import('./features/sobre-nosotros/sobre-nosotros.routes').then(
            (m) => m.SOBRE_NOSOTROS_ROUTES,
          ),
      },
      {
        path: 'contacto',
        loadChildren: () =>
          import('./features/contacto/contacto.routes').then((m) => m.CONTACTO_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
