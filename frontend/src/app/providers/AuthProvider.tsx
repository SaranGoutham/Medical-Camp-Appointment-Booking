import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createClient, Session, User, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnon) {
  // eslint-disable-next-line no-console
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in frontend env');
}

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null;

type AuthContextType = {
  session: Session | null;
  user: User | null;
  sessionLoading: boolean;
  profileLoading: boolean;
  role: 'user' | 'admin' | null;
  profileName: string | null;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: string } | void>;
  signUp: (email: string, password: string) => Promise<{ error?: string } | void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [sessionLoading, setSessionLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!supabase) {
      setSession(null);
      setUser(null);
      setSessionLoading(false);
      return;
    }
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setSessionLoading(false);
      if (data.session?.user) {
        await loadProfile(data.session.user.id);
      } else {
        setRole(null);
        setProfileName(null);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await loadProfile(newSession.user.id);
      } else {
        setRole(null);
        setProfileName(null);
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (uid: string) => {
    if (!supabase) return;
    try {
      setProfileLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('id, name, role, email')
        .eq('id', uid)
        .single();
      if (error) {
        // Leave role null if not found; dashboard will prompt until profile is created.
        setRole(null);
        setProfileName(null);
        return;
      }
      setRole((data.role as any) ?? null);
      setProfileName((data.name as any) ?? null);
    } finally {
      setProfileLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (data?.user) await loadProfile(data.user.id);
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (data?.user) await loadProfile(data.user.id);
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const refreshProfile = useMemo(() => async () => {
    if (user?.id) await loadProfile(user.id);
  }, [user?.id]);

  const value: AuthContextType = { session, user, sessionLoading, profileLoading, role, profileName, refreshProfile, signIn, signUp, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
