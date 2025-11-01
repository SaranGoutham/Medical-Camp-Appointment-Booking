import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, useAuth } from '@app/providers/AuthProvider';

type RoleOption = 'Patient' | 'Healthcare Worker';

export function SignupPage() {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [roleChoice, setRoleChoice] = useState<RoleOption>('Patient');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const result = await signUp(email, password);
    if ((result as any)?.error) {
      setLoading(false);
      setError((result as any).error);
      return;
    }
    // Best-effort profile creation (do not set role client-side)
    try {
      const { data: s } = await supabase!.auth.getUser();
      const uid = s.user?.id;
      if (uid) {
        await supabase!.from('users').upsert({ id: uid, email, name }).eq('id', uid);
      }
    } catch {}
    setLoading(false);
    setMessage('Account created! Check your email if confirmation is enabled. Redirecting to login…');
    redirectTimer.current = window.setTimeout(() => nav('/login', { replace: true }), 1500);
  };

  return (
    <div className="center-wrap">
      <div className="card auth-card">
        <h2 className="auth-title">Create Your Account</h2>
        <form onSubmit={onSubmit} className="stack">
          <label className="field">
            <span className="label">Name</span>
            <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="field">
            <span className="label">Email</span>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span className="label">Password</span>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <label className="field">
            <span className="label">Confirm Password</span>
            <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </label>
          <label className="field">
            <span className="label">I am a</span>
            <select className="select" value={roleChoice} onChange={(e) => setRoleChoice(e.target.value as RoleOption)}>
              <option>Patient</option>
              <option>Healthcare Worker</option>
            </select>
          </label>
          <div className="auth-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
            {error && <div style={{ color: 'crimson' }}>{error}</div>}
            {message && <div style={{ color: 'seagreen' }}>{message}</div>}
          </div>
        </form>
        <div className="sep" />
        <div className="label">Already have an account? <Link to="/login">Login</Link></div>
      </div>
    </div>
  );
}
