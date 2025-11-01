import type { FeatureRoute } from '@app/routes/types';
import { UserDashboardPage } from './pages/UserDashboardPage';

export const userRoutes: FeatureRoute[] = [
  {
    path: '/user',
    element: <UserDashboardPage />,
    requiresAuth: true,
    requiredRole: 'user',
  },
];

export { UserDashboardPage } from './pages/UserDashboardPage';
