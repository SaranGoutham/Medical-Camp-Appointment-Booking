import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@app/providers/AuthProvider';

type Props = PropsWithChildren<{
  requiredRole?: 'user' | 'admin';
}>;

export function ProtectedRoute({ children, requiredRole }: Props) {
  const { sessionLoading, session, role, profileLoading } = useAuth();
  if (sessionLoading || profileLoading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;
  if (requiredRole) {
    // Allow null role to pass for user routes (treat as pending/default user)
    if (requiredRole === 'user' && role == null) return children;
    if (role !== requiredRole) {
      // Unknown or different role → route to the known home or root
      if (role === 'admin') return <Navigate to="/admin" replace />;
      if (role === 'user') return <Navigate to="/user" replace />;
      return <Navigate to="/" replace />;
    }
  }
  return children;
}
