import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GetStarted() {
  const { user, session } = useAuth();
  const gh = (import.meta as any).env?.VITE_GITHUB_URL || '';

  return (
    <div style={{ maxWidth: 700 }}>
      <h1>Welcome to Medical Camp</h1>
      <p>This is the React frontend scaffold connected to your backend.</p>
      <ul>
        <li>Login with Supabase auth</li>
        <li>Call backend API with your JWT</li>
        <li>View user/admin pages</li>
      </ul>
      <div style={{ display: 'flex', gap: 10 }}>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/user">User Home</Link>
        <Link to="/admin">Admin Home</Link>
      </div>
      <hr />
      <div>
        <strong>Status:</strong>
        <div>User: {user ? user.email : 'Not signed in'}</div>
        <div>Has session: {session ? 'Yes' : 'No'}</div>
      </div>
      {gh && (
        <p>
          GitHub: <a href={gh} target="_blank" rel="noreferrer">{gh}</a>
        </p>
      )}
    </div>
  );
}

