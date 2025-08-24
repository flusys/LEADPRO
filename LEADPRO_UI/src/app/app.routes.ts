import { Route, Routes } from '@angular/router';
import { LIB_ROUTERS } from '@flusys/flusysng/core/routes';
import { authGuard } from '@flusys/flusysng/core/guards';

const moduleRoutes: Routes = [
  {
    path: 'account',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@flusys/flusysng/layout/components').then((com) => com.AppLayout),
    loadChildren: () => [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((com) => com.Dashboard),
      },
      {
        path: 'cash',
        loadComponent: () =>
          import('./pages/cash/cash').then((com) => com.Cash),
      },
      {
        path: 'expense',
        loadComponent: () =>
          import('./pages/expense/expense').then((com) => com.Expense),
      },
    ],
  },
  {
    path: 'encryption',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@flusys/flusysng/layout/components').then((com) => com.AppLayout),
    loadChildren: () => [
      {
        path: 'password',
        loadComponent: () =>
          import('./pages/encryption/encryption').then((com) => com.Encryption),
      },
      {
        path: '',
        redirectTo: 'password',
        pathMatch: 'full',
      },
    ],
  },
];

const authRoutes: Routes = [
  {
    path: 'registration',
    loadComponent: () =>
      import('./pages/register/register').then((com) => com.Register),
  },
];

const publicRoutes: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile').then((com) => com.Profile),
  },
];

export const routes: Routes = [
  ...LIB_ROUTERS(authRoutes, [], publicRoutes, moduleRoutes),
];
