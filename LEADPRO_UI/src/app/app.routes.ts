import { Routes } from '@angular/router';
import { LIB_ROUTERS } from '@flusys/flusysng/core/routes';

const baseRoutes: Routes = [{
  path: '',
  loadComponent: () => import('./pages/dashboard/dashboard')
    .then(com => com.Dashboard),
},
{
  path: 'profile',
  loadComponent: () => import('./pages/profile/profile')
    .then(com => com.Profile),
}, {
  path: 'cash',
  loadComponent: () => import('./pages/cash/cash')
    .then(com => com.Cash),
}, {
  path: 'expense',
  loadComponent: () => import('./pages/expense/expense')
    .then(com => com.Expense),
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