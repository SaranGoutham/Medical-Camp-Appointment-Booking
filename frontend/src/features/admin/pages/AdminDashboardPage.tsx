import { useEffect, useMemo, useState } from 'react';
import { supabase, useAuth } from '@providers/AuthProvider';
import { ProfileCard } from '@features/profile';

type Appointment = {
  id: number;
  date: string;
  time: string;
  status: string;
  user_name?: string;
  user_email?: string;
};

type AppointmentRow = { id: number; date: string; time: string; status: string; users?: { name?: string | null; email?: string | null } | null };

type SimpleUser = { id: string; email: string; name?: string | null; role?: string | null };

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [people, setPeople] = useState<SimpleUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

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
        const appointmentsPromise = supabase
          .from('appointments')
          .select('id, date, time, status, users:users (name, email)')
          .order('date', { ascending: true })
          .order('time', { ascending: true });
        const usersPromise = supabase
          .from('users')
          .select('id, email, name, role')
          .order('created_at', { ascending: false });
        const [{ data: appointmentData, error: appointmentError }, { data: userData, error: userError }] = await Promise.all([appointmentsPromise, usersPromise]);
        if (appointmentError) throw appointmentError;
        if (userError) throw userError;
        if (!mounted) return;
        const appointmentRows = ((appointmentData as AppointmentRow[] | null | undefined) ?? []);
        const mappedAppointments: Appointment[] = appointmentRows.map(({ id, date, time, status, users }) => ({
          id,
          date,
          time,
          status,
          user_name: users?.name ?? undefined,
          user_email: users?.email ?? undefined,
        }));
        const peopleRows = ((userData as SimpleUser[] | null | undefined) ?? []);
        setAppts(mappedAppointments);
        setPeople(peopleRows);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Failed to fetch appointments. Are you admin?');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user?.id]);

  const todayCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return appts.filter(a => a.date === today).length;
  }, [appts]);

  const filteredPeople = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return people;
    return people.filter(p => (p.name || '').toLowerCase().includes(term) || (p.email || '').toLowerCase().includes(term));
  }, [people, q]);

  return (
    <div className="stack">
      <header className="row wrap" style={{ alignItems: 'center' }}>
        <div className="card" style={{ padding: 14 }}>
          <div className="label">Admin Dashboard</div>
          <div className="muted">Signed in as: <strong>{user?.email}</strong></div>
        </div>
      </header>

      <section className="grid grid-3">
        <article className="card">
          <div className="label">Total Patients</div>
          <h3 style={{ margin: '6px 0 0' }}>{people.length}</h3>
        </article>
        <article className="card">
          <div className="label">Today’s Screenings</div>
          <h3 style={{ margin: '6px 0 0' }}>{todayCount}</h3>
        </article>
        <article className="card">
          <div className="label">Active Staff</div>
          <h3 style={{ margin: '6px 0 0' }}>-</h3>
        </article>
      </section>

      <section id="profile" className="grid">
        <ProfileCard variant="admin" />
      </section>

      <section className="grid">
        <article id="patients" className="card">
          <div className="row wrap" style={{ alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Patient Management</h3>
            <div className="right row" style={{ gap: 8 }}>
              <input className="input" placeholder="Search patients…" value={q} onChange={(e) => setQ(e.target.value)} />
              <button className="btn btn-secondary">Export</button>
            </div>
          </div>
          <div className="sep" />
          {loading && <div>Loading…</div>}
          {error && <div style={{ color: 'crimson' }}>{error}</div>}
          {!loading && !error && (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredPeople.map(p => (
                  <tr key={p.id}>
                    <td>{p.name || '-'}</td>
                    <td>{p.email}</td>
                    <td>{p.role || 'user'}</td>
                  </tr>
                ))}
                {filteredPeople.length === 0 && (
                  <tr><td colSpan={3} className="muted">No users</td></tr>
                )}
              </tbody>
            </table>
          )}
        </article>

        <article id="camps" className="card">
          <div className="row wrap" style={{ alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Camp Schedule</h3>
            <div className="right"><button className="btn btn-primary">Add New Camp</button></div>
          </div>
          <p className="muted">Calendar integration placeholder.</p>
        </article>

        <article id="reports" className="card">
          <h3 style={{ marginTop: 0 }}>Reports & Analytics</h3>
          <p className="muted">Charts coming soon. Generate PDF report here.</p>
          <button className="btn btn-secondary">Generate PDF Report</button>
        </article>

        <article className="card">
          <h3 style={{ marginTop: 0 }}>All Screenings</h3>
          {loading && <div>Loading…</div>}
          {error && <div style={{ color: 'crimson' }}>{error}</div>}
          {!loading && !error && (
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appts.map(a => (
                  <tr key={a.id}>
                    <td>{a.user_name || '-'}</td>
                    <td>{a.user_email || '-'}</td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td>{a.status}</td>
                  </tr>
                ))}
                {appts.length === 0 && (
                  <tr><td colSpan={5} className="muted">No appointments</td></tr>
                )}
              </tbody>
            </table>
          )}
        </article>
      </section>
    </div>
  );
}
