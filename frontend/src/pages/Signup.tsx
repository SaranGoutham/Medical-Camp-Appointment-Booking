import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const result = await signUp(email, password);
    setLoading(false);
    if ((result as any)?.error) {
      setError((result as any).error);
      return;
    }
    setMessage('Sign up successful. Check your email for confirmation if enabled. You can now login.');
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h2>Sign Up</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Signing up…' : 'Create account'}</button>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        {message && <div style={{ color: 'seagreen' }}>{message}</div>}
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

