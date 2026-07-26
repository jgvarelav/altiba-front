import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token;

  // Skips localtunnel's browser warning interstitial when apiUrl points at a
  // *.loca.lt tunnel (see environments/environment.ts) — harmless against a
  // real backend, safe to leave in even after the tunnel is gone.
  const headers: Record<string, string> = { 'Bypass-Tunnel-Reminder': 'true' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return next(req.clone({ setHeaders: headers }));
};
