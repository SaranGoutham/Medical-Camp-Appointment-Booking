import type { FeatureRoute } from '@app/routes/types';
import { lazy } from 'react';

const LazyAdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));

export const adminRoutes: FeatureRoute[] = [
  {
    path: '/admin',
    element: <LazyAdminDashboardPage />,
    requiresAuth: true,
    requiredRole: 'admin',
  },
];

export { AdminDashboardPage } from './pages/AdminDashboardPage';
