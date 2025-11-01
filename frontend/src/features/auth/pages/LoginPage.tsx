import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import groupDocs from '@assets/group-docs.png';
import { useAuth } from '@providers/AuthProvider';

export function LoginPage() {
  const { signIn, session, sessionLoading, role, profileLoading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionLoading || profileLoading) return;
    if (!session) return;
    const target = role === 'admin' ? '/admin' : '/user';
    nav(target, { replace: true });
  }, [session, sessionLoading, profileLoading, role, nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if ((result as any)?.error) {
      setError((result as any).error);
      return;
    }
  };

  return (
    <div className="center-wrap">
      <div className="auth-grid" style={{ width: '100%', maxWidth: 980 }}>
        {/* Row 1: form and illustration share the same z-index */}
        <div className="card auth-card z-row z-row-1" data-row={1}>
          <h2 className="auth-title">Medical Camp Login</h2>
          <form onSubmit={onSubmit} className="stack">
            <label className="field">
              <span className="label">Email</span>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className="field">
              <span className="label">Password</span>
              <div className="row" style={{ gap: 8 }}>
                <input
                  className="input"
                  style={{ flex: 1 }}
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                />
                <button type="button" className="btn btn-ghost" onClick={() => setShowPwd(v => !v)} aria-label={showPwd ? 'Hide password' : 'Show password'}>
                  {showPwd ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>
            <div className="auth-row">
              <span />
              <a className="label" href="#forgot">Forgot Password?</a>
            </div>
            <div className="auth-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Signing in…' : 'Login with Supabase'}
              </button>
              {error && <div style={{ color: 'crimson' }}>{error}</div>}
            </div>
          </form>
          <div className="sep" />
          <div className="label">Don’t have an account? <Link to="/signup">Sign Up</Link></div>
        </div>
        <div className="card illus-card z-row z-row-1" data-row={1}>
          <div className="illus-wrap">
            <img className="illus-img" src={groupDocs} alt="" aria-hidden />
          </div>
        </div>

        {/* Row 2: small info/notice beneath, higher z-index */}
        <div className="card z-row z-row-2" data-row={2} style={{ gridColumn: '1 / -1' }}>
          <div className="label" style={{ textAlign: 'center' }}>
            Secure login with encrypted transport and least-privilege access.
          </div>
        </div>
      </div>
    </div>
  );
}
