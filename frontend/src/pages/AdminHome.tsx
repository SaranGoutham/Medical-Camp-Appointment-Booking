import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type Appointment = {
  id: number;
  date: string;
  time: string;
  status: string;
  user_name?: string;
  user_email?: string;
};

export default function AdminHome() {
  const { user } = useAuth();
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<Appointment[]>('/appointments');
        if (!mounted) return;
        setAppts(res.data);
      } catch (e: any) {
        setError(e?.response?.data?.message || e.message || 'Failed to fetch appointments. Are you admin?');
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h2>Admin Home</h2>
      <p>Signed in as: <strong>{user?.email}</strong></p>
      {loading && <div>Loading…</div>}
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      {!loading && !error && (
        <table style={{ borderCollapse: 'collapse', minWidth: 650 }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>User</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Email</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Date</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Time</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {appts.map(a => (
              <tr key={a.id}>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{a.user_name || '-'}</td>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{a.user_email || '-'}</td>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{a.date}</td>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{a.time}</td>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{a.status}</td>
              </tr>
            ))}
            {appts.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 8, color: '#666' }}>No appointments.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

