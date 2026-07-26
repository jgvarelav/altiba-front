import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { EmprendimientosList } from './pages/emprendimientos-list/emprendimientos-list';
import { EmprendimientoForm } from './pages/emprendimiento-form/emprendimiento-form';
import { CategoriasList } from './pages/categorias-list/categorias-list';

export const EMPRENDIMIENTOS_ROUTES: Routes = [
  { path: '', component: EmprendimientosList },
  { path: 'categorias', component: CategoriasList },
  { path: 'crear', component: EmprendimientoForm, canActivate: [authGuard] },
  { path: ':documentId/editar', component: EmprendimientoForm, canActivate: [authGuard] },
];
