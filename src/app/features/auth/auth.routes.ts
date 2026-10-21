import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { OlvideContrasena } from './pages/olvide-contrasena/olvide-contrasena';
import { RestablecerContrasena } from './pages/restablecer-contrasena/restablecer-contrasena';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'olvide-contrasena', component: OlvideContrasena },
  // Target of the link in Strapi's reset email (see configureResetPassword in altiba-back).
  { path: 'restablecer-contrasena', component: RestablecerContrasena },
];
