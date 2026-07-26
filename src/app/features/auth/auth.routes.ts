import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
];
