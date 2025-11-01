import type { JSX } from 'react';

export type FeatureRoute = {
  path: string;
  element: JSX.Element;
  requiresAuth?: boolean;
  requiredRole?: 'user' | 'admin';
};
