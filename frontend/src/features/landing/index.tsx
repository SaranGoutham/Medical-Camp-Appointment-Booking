import type { FeatureRoute } from '@app/routes/types';
import { GetStartedPage } from './pages/GetStartedPage';

export const landingRoutes: FeatureRoute[] = [
  { path: '/', element: <GetStartedPage /> },
];

export { GetStartedPage } from './pages/GetStartedPage';
