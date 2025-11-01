import { useMemo } from 'react';
import { useAuth } from '@app/providers/AuthProvider';

type ProfileCardProps = {
  variant: 'user' | 'admin';
};

export function ProfileCard({ variant }: ProfileCardProps) {
  const { user, role, profileName } = useAuth();
  const heading = useMemo(() => (variant === 'admin' ? 'Admin Profile' : 'Your Profile'), [variant]);

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <h2 style={{ marginTop: 0 }}>{heading}</h2>
      <div className="stack">
        <div><span className="label">Name</span><div>{profileName || '-'}</div></div>
        <div><span className="label">Email</span><div>{user?.email}</div></div>
        <div><span className="label">Role</span><div>{role || variant}</div></div>
      </div>
    </div>
  );
}
