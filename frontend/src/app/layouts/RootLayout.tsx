import { useCallback, useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@app/providers/AuthProvider';

type LinkItem = { key: string; type: 'link'; label: string; to: string; className?: string };
type AnchorItem = { key: string; type: 'anchor'; label: string; href: string; className?: string };
type NavItem = LinkItem | AnchorItem;

export function RootLayout() {
  const { session, sessionLoading, signOut, role } = useAuth();
  const { pathname } = useLocation();
  const isAuthed = Boolean(session);
  const normalizedRole: 'admin' | 'user' = role === 'admin' ? 'admin' : 'user';
  const isDashboardView = isAuthed && (pathname.startsWith('/user') || pathname.startsWith('/admin'));
  const profileTarget = normalizedRole === 'admin' ? '/admin#profile' : '/user#profile';

  const headerItems = useMemo<NavItem[]>(() => {
    if (!isAuthed) {
      return [
        { key: 'features', type: 'anchor', href: '/#features', label: 'Features' },
        { key: 'login', type: 'link', to: '/login', label: 'Login' },
        { key: 'signup', type: 'link', to: '/signup', label: 'Sign Up', className: 'btn btn-primary' },
      ];
    }
    if (normalizedRole === 'admin') {
      return [
        { key: 'dashboard', type: 'link', to: '/admin', label: 'Dashboard' },
        { key: 'profile', type: 'link', to: profileTarget, label: 'Profile' },
      ];
    }
    return [
      { key: 'home', type: 'link', to: '/user', label: 'Home' },
      { key: 'profile', type: 'link', to: profileTarget, label: 'Profile' },
    ];
  }, [isAuthed, normalizedRole, profileTarget]);

  const sidebarItems = useMemo<NavItem[]>(() => {
    if (!isDashboardView) return [];
    if (normalizedRole === 'admin') {
      return [
        { key: 'dashboard', type: 'link', to: '/admin', label: '🏠 Dashboard' },
        { key: 'patients', type: 'anchor', href: '#patients', label: '👥 Patients' },
        { key: 'camps', type: 'anchor', href: '#camps', label: '🗓️ Camps' },
        { key: 'reports', type: 'anchor', href: '#reports', label: '📈 Reports' },
        { key: 'profile', type: 'anchor', href: '#profile', label: '👤 Profile' },
      ];
    }
    return [
      { key: 'home', type: 'link', to: '/user', label: '🏠 Home' },
      { key: 'history', type: 'anchor', href: '#history', label: '📋 History' },
      { key: 'book', type: 'anchor', href: '#book', label: '➕ Book' },
      { key: 'profile', type: 'anchor', href: '#profile', label: '👤 Profile' },
    ];
  }, [isDashboardView, normalizedRole]);

  const bottomNavItems = useMemo<NavItem[]>(() => {
    if (!isDashboardView) return [];
    if (normalizedRole === 'admin') {
      return [
        { key: 'home', type: 'link', to: '/admin', label: '🏠 Home' },
        { key: 'patients', type: 'anchor', href: '#patients', label: '👥 Patients' },
        { key: 'reports', type: 'anchor', href: '#reports', label: '📈 Reports' },
        { key: 'profile', type: 'link', to: profileTarget, label: '👤 Profile' },
      ];
    }
    return [
      { key: 'home', type: 'link', to: '/user', label: '🏠 Home' },
      { key: 'history', type: 'anchor', href: '#history', label: '📋 History' },
      { key: 'book', type: 'anchor', href: '#book', label: '➕ Book' },
      { key: 'profile', type: 'link', to: profileTarget, label: '👤 Profile' },
    ];
  }, [isDashboardView, normalizedRole, profileTarget]);

  const renderNavItem = (item: NavItem, className?: string) => {
    const combinedClassName = [item.className, className].filter(Boolean).join(' ') || undefined;
    if (item.type === 'link') {
      return (
        <Link key={item.key} to={item.to} className={combinedClassName}>
          {item.label}
        </Link>
      );
    }
    return (
      <a key={item.key} href={item.href} className={combinedClassName}>
        {item.label}
      </a>
    );
  };

  const handleSignOut = useCallback(() => {
    void signOut();
  }, [signOut]);

  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="brand">Medical Camp</Link>
        <nav className="nav">
          {headerItems.map(item => renderNavItem(item))}
          {isAuthed && (
            <button
              className="btn btn-secondary"
              onClick={handleSignOut}
              disabled={sessionLoading}
            >
              Logout
            </button>
          )}
        </nav>
      </header>
      <main className="container">
        {isDashboardView ? (
          <div className="layout">
            <aside className="sidebar card">
              <nav className="stack">
                {sidebarItems.map(item => renderNavItem(item, 'side-item'))}
              </nav>
            </aside>
            <section>
              <Outlet />
            </section>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      {bottomNavItems.length > 0 && (
        <nav className="bottom-nav">
          {bottomNavItems.map(item => renderNavItem(item))}
        </nav>
      )}
    </div>
  );
}
