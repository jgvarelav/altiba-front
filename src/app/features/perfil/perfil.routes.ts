import { Routes } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { ComingSoon } from '../../shared/components/coming-soon/coming-soon';

export const PERFIL_ROUTES: Routes = [
  { path: '', component: ComingSoon, data: { title: 'Mi perfil', icon: faUser } },
];
