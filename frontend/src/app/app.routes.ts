import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard) },
  {
    path: 'campanha/:id',
    loadComponent: () => import('./features/diagnostico/diagnostico').then((m) => m.Diagnostico),
  },
  {
    path: 'campanha/:id/evidencias',
    loadComponent: () => import('./features/evidencias/evidencias').then((m) => m.Evidencias),
  },
  { path: '**', redirectTo: '' },
];
