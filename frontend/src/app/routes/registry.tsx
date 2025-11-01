import type { FeatureRoute } from './types';
import { adminRoutes } from '@features/admin';
import { authRoutes } from '@features/auth';
import { landingRoutes } from '@features/landing';
import { userRoutes } from '@features/user';

export const featureRoutes: FeatureRoute[] = [
  ...landingRoutes,
  ...authRoutes,
  ...userRoutes,
  ...adminRoutes,
];
