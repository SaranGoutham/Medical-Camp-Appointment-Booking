import type { FeatureRoute } from '@app/routes/types';
import { lazy } from 'react';

const LazyLoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const LazySignupPage = lazy(() => import('./pages/SignupPage').then(m => ({ default: m.SignupPage })));

export const authRoutes: FeatureRoute[] = [
  { path: '/login', element: <LazyLoginPage /> },
  { path: '/signup', element: <LazySignupPage /> },
];

export { LoginPage } from './pages/LoginPage';
export { SignupPage } from './pages/SignupPage';
