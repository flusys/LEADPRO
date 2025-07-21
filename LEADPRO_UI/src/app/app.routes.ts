import { Routes } from '@angular/router';
import { LIB_ROUTERS } from '@flusys/flusysng/core/routes';

const baseRoutes: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile')
      .then(com => com.Profile),
  },
]
const authRoutes: Routes = [
  {
    path: 'registration',
    loadComponent: () => import('./pages/register/register')
      .then(com => com.Register),
  },
]
export const routes: Routes = [
  ...LIB_ROUTERS(authRoutes, baseRoutes),
];