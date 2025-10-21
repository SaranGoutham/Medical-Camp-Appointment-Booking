import { Route, Routes, Link, Navigate } from 'react-router-dom';
import GetStarted from './pages/GetStarted';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserHome from './pages/UserHome';
import AdminHome from './pages/AdminHome';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { sessionLoading, session } = useAuth();
  if (sessionLoading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { session, signOut } = useAuth();
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #eee' }}>
        <Link to="/" style={{ fontWeight: 700, textDecoration: 'none', color: 'inherit' }}>Medical Camp</Link>
        <nav style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
          <Link to="/">Get Started</Link>
          <Link to="/user">User Home</Link>
          <Link to="/admin">Admin Home</Link>
          {!session && <Link to="/login">Login</Link>}
          {!session && <Link to="/signup">Sign Up</Link>}
          {session && <button onClick={signOut}>Logout</button>}
        </nav>
      </header>
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<GetStarted />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

