import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { ComunidadList } from './pages/comunidad-list/comunidad-list';
import { PublicacionForm } from './pages/publicacion-form/publicacion-form';
import { PublicacionDetail } from './pages/publicacion-detail/publicacion-detail';

export const COMUNIDAD_ROUTES: Routes = [
  { path: '', component: ComunidadList },
  { path: 'crear', component: PublicacionForm, canActivate: [authGuard] },
  { path: ':documentId/editar', component: PublicacionForm, canActivate: [authGuard] },
  { path: ':documentId', component: PublicacionDetail },
];
