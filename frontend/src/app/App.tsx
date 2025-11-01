import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { RootLayout } from './layouts/RootLayout';
import { AuthProvider } from './providers/AuthProvider';
import { featureRoutes } from './routes/registry';
import { ProtectedRoute } from './routes/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
        <Routes>
          <Route element={<RootLayout />}>
            {featureRoutes.map(({ path, element, requiresAuth, requiredRole }) => {
              const wrappedElement = requiresAuth
                ? <ProtectedRoute requiredRole={requiredRole}>{element}</ProtectedRoute>
                : element;
              return <Route key={path} path={path} element={wrappedElement} />;
            })}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
