import { useEffect, useMemo, useState } from 'react';
import { supabase, useAuth } from '@app/providers/AuthProvider';
import { ProfileCard } from '@features/profile';

type Appointment = {
  id: number;
  date: string;
  time: string;
  status: string;
};

export function UserDashboardPage() {
  const { user, profileName } = useAuth();
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!supabase || !user?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('appointments')
          .select('id, date, time, status')
          .eq('user_id', user.id)
          .order('date', { ascending: true })
          .order('time', { ascending: true });
        if (error) throw error;
        if (!mounted) return;
        setAppts((data as Appointment[]) || []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Failed to fetch appointments');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user?.id]);

  const greeting = useMemo(() => {
    if (profileName) return profileName.split(' ')[0];
    const email = user?.email || '';
    return email.includes('@') ? email.split('@')[0] : 'there';
  }, [profileName, user?.email]);

  const nextAppt = useMemo(() => {
    const upcoming = appts
      .filter(a => a.status?.toLowerCase() !== 'cancelled')
      .slice()
      .sort((a, b) => (a.date + ' ' + a.time).localeCompare(b.date + ' ' + b.time));
    return upcoming[0];
  }, [appts]);

  const testsCompleted = appts.filter(a => /completed/i.test(a.status)).length;
  const healthScore = 82 + Math.min(10, testsCompleted); // playful placeholder

  return (
    <div className="stack">
      <header className="row wrap" style={{ alignItems: 'center' }}>
        <div className="card" style={{ padding: 14 }}>
          <div className="label">Welcome back</div>
          <h2 style={{ margin: 0 }}>Hi, {greeting}!</h2>
        </div>
        <div className="right row wrap" style={{ gap: 8 }}>
          <button className="btn btn-primary">Book New Screening</button>
          <button className="btn btn-secondary">Download Report</button>
        </div>
      </header>

      <section className="grid grid-3">
        <article className="card">
          <div className="label">Next Screening Date</div>
          <h3 style={{ margin: '6px 0 0' }}>{nextAppt ? `${nextAppt.date} at ${nextAppt.time}` : 'Not scheduled'}</h3>
        </article>
        <article className="card">
          <div className="label">Tests Completed</div>
          <h3 style={{ margin: '6px 0 0' }}>{testsCompleted}</h3>
        </article>
        <article className="card">
          <div className="label">Health Score</div>
          <h3 style={{ margin: '6px 0 0' }}>{healthScore}/100</h3>
        </article>
      </section>

      <section className="grid" id="book">
        <article className="card">
          <h3 style={{ marginTop: 0 }}>Upcoming Events</h3>
          {loading && <div>Loading…</div>}
          {error && <div style={{ color: 'crimson' }}>{error}</div>}
          {!loading && !error && (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appts.map(a => (
                  <tr key={a.id}>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td>{a.status}</td>
                  </tr>
                ))}
                {appts.length === 0 && (
                  <tr><td colSpan={3} className="muted">No appointments yet.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </article>
        <article id="history" className="card">
          <h3 style={{ marginTop: 0 }}>Health History</h3>
          <p className="muted">Your past screening results will appear here.</p>
        </article>
      </section>

      <section id="profile" className="grid">
        <ProfileCard variant="user" />
      </section>
    </div>
  );
}
